from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.http import JsonResponse
import json

from student_management_app.models import CustomUser, NotificationStaffs, Branches, Batch, Student, Attendances, AttendanceReport, Staffs, LeaveReportStaff, AdminHOD

@api_view(['GET'])
def staff_home(request):
    staff = get_object_or_404(Staffs, admin=request.user.id)
    branches = Branches.objects.filter(staffbranchassignment__staff=staff.admin)

    total_students = 0
    total_attendance = 0
    branch_batch_data = []

    for branch in branches:
        batches = Batch.objects.filter(branch=branch)
        for batch in batches:
            student_count = Student.objects.filter(branch=branch, batch=batch).count()
            total_students += student_count

            attendance_count = Attendances.objects.filter(batch=batch).count()
            total_attendance += attendance_count

            branch_batch_data.append({
                "branch_name": branch.branch_name,
                "batch_name": batch.template.get_name_display(),
                "student_count": student_count,
                "attendance_count": attendance_count
            })

    leave_count = LeaveReportStaff.objects.filter(staff_id=staff.id, leave_status=1).count()

    context = {
        "students_count": total_students,
        "attendance_count": total_attendance,
        "leave_count": leave_count,
        "branch_count": branches.count(),
        "branch_batch_data": branch_batch_data,
    }

    return Response(context, status=status.HTTP_200_OK)

@api_view(['GET'])
def staff_view_students(request):
    branches = Branches.objects.filter(staffbranchassignment__staff=request.user.id)
    branch_list = [{"id": branch.id, "name": branch.branch_name} for branch in branches]
    return Response(branch_list, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def get_batches_by_branch(request):
    branch_id = request.data.get('branch_id')
    if branch_id:
        batches = Batch.objects.filter(branch_id=branch_id).values('id', 'template__name')
        batch_list = [{'id': batch['id'], 'name': batch['template__name']} for batch in batches]
        return Response(batch_list, status=status.HTTP_200_OK)
    else:
        return Response([], status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def get_students_by_branch_and_batch(request):
    branch_id = request.data.get('branch_id')
    batch_id = request.data.get('batch_id')

    students = Student.objects.filter(branch_id=branch_id)
    if batch_id != 'all':
        students = students.filter(batch_id=batch_id)

    student_list = list(students.values('id', 'admin__first_name', 'admin__last_name', 'batch__template__name'))
    return Response(student_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def staff_take_attendance(request):
    branches = Branches.objects.filter(staffbranchassignment__staff=request.user.id)
    branch_list = [{"id": branch.id, "name": branch.branch_name} for branch in branches]
    return Response(branch_list, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def get_batches(request):
    branch_id = request.data.get('branch_id')
    if branch_id:
        batches = Batch.objects.filter(branch_id=branch_id).select_related('template').values('id', 'template__name')
        batch_list = [{'id': batch['id'], 'name': batch['template__name']} for batch in batches]
        return Response(batch_list, status=status.HTTP_200_OK)
    else:
        return Response([], status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def get_students(request):
    branch_id = request.data.get('branch_id')
    batch_id = request.data.get('batch_id')

    try:
        students = Student.objects.filter(branch_id=branch_id, batch_id=batch_id).values('id', 'admin__first_name', 'admin__last_name')
        return Response(list(students), status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def save_attendance_data(request):
    try:
        student_ids = request.data.get("student_ids")
        branch_id = request.data.get("branch_id")
        batch_id = request.data.get("batch_id")
        attendance_date = request.data.get("attendance_date")
        attendance_time = request.data.get("attendance_time")

        if not all([student_ids, branch_id, batch_id, attendance_date, attendance_time]):
            return Response({"status": "ERR", "message": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        branch = Branches.objects.get(id=branch_id)
        batch = Batch.objects.get(id=batch_id)
        students = json.loads(student_ids)

        attendance = Attendances(branch=branch, batch=batch, attendance_date=attendance_date, attendance_time=attendance_time)
        attendance.save()

        for stud in students:
            student_id = stud.get('id')
            student_status = stud.get('status')

            try:
                student = Student.objects.get(id=student_id)
                attendance_report, created = AttendanceReport.objects.get_or_create(
                    student_id=student, attendance_id=attendance
                )
                attendance_report.status = student_status
                attendance_report.handle_attendance(student_status)

            except Student.DoesNotExist:
                continue

        return Response({"status": "OK", "message": "Attendance saved successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"status": "ERR", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def send_fee_reminder_email(request):
    student_id = request.data.get("student_id")
    unpaid = request.data.get("unpaid", False)

    try:
        student = Student.objects.get(id=student_id)
        if unpaid:
            subject = "Urgent Reminder: Unpaid Sessions Continuing"
            message = (
                f"Dear {student.admin.first_name},\n\n"
                f"Our records indicate that you have attended {student.unpaid_sessions} additional sessions "
                f"beyond your initial 10 sessions without payment. Please make the necessary payment to continue "
                f"participation in the program. Failure to do so may result in suspension of your attendance.\n\n"
                f"Thank you."
            )
        else:
            subject = "Fee Reminder: 10 Sessions Completed"
            message = (
                f"Dear {student.admin.first_name},\n\n"
                f"Congratulations on completing your 10th session! To continue with the program, please proceed with the "
                f"payment for the next set of sessions.\n\nThank you."
            )

        recipient_email = student.admin.email

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient_email],
            fail_silently=False,
        )
        return Response({"status": "OK", "message": f"Fee reminder email sent to {student.admin.email}"}, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({"status": "ERR", "message": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"status": "ERR", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def notify_hod_about_unpaid_sessions(request):
    student_id = request.data.get("student_id")
    branch_id = request.data.get("branch_id")
    batch_id = request.data.get("batch_id")

    try:
        student = Student.objects.get(id=student_id)
        branch = Branches.objects.get(id=branch_id)
        batch = Batch.objects.get(id=batch_id)

        hod_email = AdminHOD.objects.first().admin.email  # Assuming only one HOD, modify if multiple HODs
        subject = "Alert: Student Exceeded Unpaid Sessions"
        message = (
            f"Dear HOD,\n\n"
            f"The student {student.admin.first_name} {student.admin.last_name} from Branch: {branch.branch_name} "
            f"and Batch: {batch.template.name} has attended {student.unpaid_sessions} unpaid sessions without completing their fees.\n\n"
            f"Please take the necessary action.\n\n"
            f"Student Details:\n"
            f"Name: {student.admin.first_name} {student.admin.last_name}\n"
            f"Username: {student.admin.username}\n"
            f"Branch: {branch.branch_name}\n"
            f"Batch: {batch.template.name}\n"
            f"Total Sessions Attended: {student.sessions_attended}\n"
            f"Unpaid Sessions: {student.unpaid_sessions}\n\n"
            f"Thank you."
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [hod_email],
            fail_silently=False,
        )
        return Response({"status": "OK", "message": f"Notification email sent to HOD at {hod_email}"}, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({"status": "ERR", "message": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"status": "ERR", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def staff_update_attendance(request):
    branches = Branches.objects.filter(staffbranchassignment__staff=request.user.id)
    branch_list = [{"id": branch.id, "name": branch.branch_name} for branch in branches]
    return Response(branch_list, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def get_attendance_dates(request):
    branch_id = request.data.get("branch_id")
    batch_id = request.data.get("batch_id")

    try:
        branch = Branches.objects.get(id=branch_id)
        batch = Batch.objects.get(id=batch_id)
        attendance = Attendances.objects.filter(branch=branch, batch=batch).values('id', 'attendance_date')
        attendance_dates = [{"id": att['id'], "attendance_date": str(att['attendance_date'])} for att in attendance]
        return Response(attendance_dates, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def get_attendance_student(request):
    attendance_id = request.data.get("attendance_id")

    try:
        attendance = Attendances.objects.get(id=attendance_id)
        attendance_data = AttendanceReport.objects.filter(attendance_id=attendance).values(
            'student_id__admin__first_name',
            'student_id__admin__last_name',
            'student_id__id',
            'status'
        )
        student_list = [{
            "id": student['student_id__id'],
            "name": student['student_id__admin__first_name'] + " " + student['student_id__admin__last_name'],
            "status": student['status']
        } for student in attendance_data]
        return Response(student_list, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def save_updateattendance_data(request):
    try:
        student_ids = request.data.get("student_ids")
        attendance_id = request.data.get("attendance_id")

        json_students = json.loads(student_ids)
        attendance = Attendances.objects.get(id=attendance_id)

        for stud in json_students:
            student = Student.objects.get(id=stud['id'])
            attendance_report = AttendanceReport.objects.get(student_id=student, attendance_id=attendance)
            attendance_report.status = stud['status']
            attendance_report.save()

        return Response({"status": "OK", "message": "Attendance updated successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "ERR", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def staff_apply_leave(request):
    staff_obj = get_object_or_404(Staffs, admin=request.user.id)
    leave_data = LeaveReportStaff.objects.filter(staff_id=staff_obj)
    leave_list = [{"id": leave.id, "leave_date": leave.leave_date, "leave_message": leave.leave_message, "leave_status": leave.leave_status} for leave in leave_data]
    return Response(leave_list, status=status.HTTP_200_OK)

@api_view(['POST'])
def staff_apply_leave_save(request):
    leave_date = request.data.get("leave_date")
    leave_msg = request.data.get("leave_msg")

    staff_obj = get_object_or_404(Staffs, admin=request.user.id)
    try:
        leave_report = LeaveReportStaff(staff_id=staff_obj, leave_date=leave_date, leave_message=leave_msg, leave_status=0)
        leave_report.save()
        return Response({"status": "OK", "message": "Successfully Applied for Leave"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "ERR", "message": "Failed To Apply for Leave"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def staff_profile(request):
    user = get_object_or_404(CustomUser, id=request.user.id)
    staff = get_object_or_404(Staffs, admin=user)
    user_data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "username": user.username,
    }
    staff_data = {
        "id": staff.id,
        "address": staff.address,
    }
    return Response({"user": user_data, "staff": staff_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def staff_profile_save(request):
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    address = request.data.get("address")
    password = request.data.get("password")

    try:
        customuser = CustomUser.objects.get(id=request.user.id)
        customuser.first_name = first_name
        customuser.last_name = last_name
        if password:
            customuser.set_password(password)
        customuser.save()

        staff = Staffs.objects.get(admin=customuser.id)
        staff.address = address
        staff.save()
        return Response({"status": "OK", "message": "Successfully Updated Profile"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "ERR", "message": "Failed to Update Profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def staff_fcmtoken_save(request):
    token = request.data.get("token")
    try:
        staff = Staffs.objects.get(admin=request.user.id)
        staff.fcm_token = token
        staff.save()
        return Response({"status": "OK", "message": "Token saved successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "ERR", "message": "Failed to save token."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def staff_all_notification(request):
    staff = get_object_or_404(Staffs, admin=request.user.id)
    notifications = NotificationStaffs.objects.filter(staff_id=staff.id)
    notification_list = [{"id": notification.id, "message": notification.message, "created_at": notification.created_at} for notification in notifications]
    return Response(notification_list, status=status.HTTP_200_OK)