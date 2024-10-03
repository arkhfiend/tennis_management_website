from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from student_management_app.models import CustomUser, Staffs, Student, \
     LeaveReportStaff, AttendanceReport,FeedBackStudents, \
    NotificationStudent, NotificationStaffs, Branches, Batch, StaffBranchAssignment, DietPlans, DietPlanAssignments, \
    Attendances
from student_management_app.forms import AddStudentForm, EditStudentForm, AssignStaffForm, DietPlanForm
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from rest_framework.permissions import AllowAny
logger = logging.getLogger(__name__)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .models import Student, Staffs, Branches, Batch, PaymentRecord, SalaryRecord, AttendanceReport, NotificationStudent, FeedBackStudents

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_home(request):
    # Count total students and staff
    student_count = Student.objects.count()
    staff_count = Staffs.objects.count()

    # Count total branches and batches
    branch_count = Branches.objects.count()
    batch_count = Batch.objects.count()

    # Calculate total payments and salaries
    total_payments = PaymentRecord.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    total_salaries = SalaryRecord.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    profit = total_payments - total_salaries

    # For each branch, collect associated batch information and student count
    branches = Branches.objects.all()
    branch_data = []

    for branch in branches:
        batches = Batch.objects.filter(branch_id=branch.id).count()
        students = Student.objects.filter(branch_id=branch.id).count()
        branch_data.append({
            'name': branch.branch_name,
            'batches': batches,
            'students': students
        })

    # Handle branch and batch filtering
    selected_branch = request.GET.get('branch')
    selected_batch = request.GET.get('batch')

    if selected_branch and selected_batch:
        students = Student.objects.filter(branch_id=selected_branch, batch_id=selected_batch)
    else:
        students = Student.objects.all()

    student_name_list = []
    notifications_list = []
    feedback_list = []

    for student in students:
        attendance = AttendanceReport.objects.filter(student_id=student.id, status=True).count()
        student_name_list.append({
            'student_name': student.admin.username,
            'attendance_count': attendance
        })

        # Fetch recent notifications and feedback
        recent_notifications = NotificationStudent.objects.filter(student_id=student).order_by('-created_at')[:5]
        recent_feedback = FeedBackStudents.objects.filter(student_id=student).select_related('staff_id', 'student_id').order_by('-created_at')[:5]

        notifications_list.append([{
            'title': notification.title,
            'message': notification.message,
            'created_at': notification.created_at
        } for notification in recent_notifications])

        feedback_list.extend([{
            'student_id': feedback.student_id.id if feedback.student_id else None,
            'staff_id': feedback.staff_id.id if feedback.staff_id else None,
            'message': feedback.message,
            'created_at': feedback.created_at
        } for feedback in recent_feedback])

    # Prepare the response data
    response_data = {
        "student_count": student_count,
        "staff_count": staff_count,
        "branch_count": branch_count,
        "batch_count": batch_count,
        "branch_data": branch_data,
        "student_name_list": student_name_list,
        "notifications_list": notifications_list,
        "feedback_list": feedback_list,
        "total_payments": total_payments,
        "total_salaries": total_salaries,
        "profit": profit,
        "branches": [{'id': branch.id, 'name': branch.branch_name} for branch in branches],
    }

    return Response(response_data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([AllowAny])
def add_staff_save(request):
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    salary = request.data.get("salary")
    try:
        user = CustomUser.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name, user_type=2)
       # user.staffs.salary = salary
        staff = user.staffs
        staff.salary = float(salary)
        staff.save()
        return Response({"message": "Staff added successfully"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_staff(request, staff_id):
    try:
        # Attempt to retrieve the staff member
        staff_member = Staffs.objects.get(id=staff_id)
        staff_member.delete()  # Delete the staff member
        return Response({"message": "Staff member deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Staffs.DoesNotExist:
        return Response({"error": "Staff member not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_student(request, id):
    try:
        student = CustomUser.objects.get(id=id)
        student.delete()
        return Response({"message": "Student deleted successfully"})
    except CustomUser.DoesNotExist:
        return Response({"error": "Student does not exist"}, status=404)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_diet(request, id):
    try:
        diet = DietPlans.objects.get(id=id)
        diet.delete()
        return Response({"message": "Diet plan assignment deleted successfully"})
    except DietPlans.DoesNotExist:
        return Response({"error": "Diet plan assignment does not exist"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_branch_save(request):
    branch = request.data.get("branch")
    try:
        Branches.objects.create(branch_name=branch)
        return Response({"message": "Branch added successfully"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def branch_list(request):
    branches = Branches.objects.all()
    data = [{"id": branch.id, "branch_name": branch.branch_name} for branch in branches]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def batch_list(request, branch_id):
    branch = get_object_or_404(Branches, pk=branch_id)
    batches = Batch.objects.filter(branch=branch).select_related('template')
    data = [{"id": batch.id, "template_name": batch.template.name} for batch in batches]
    return Response({"branch": branch.branch_name, "batches": data})

@api_view(['GET'])
@permission_classes([AllowAny])
def student_details(request, branch_id, batch_id):
    branch = get_object_or_404(Branches, pk=branch_id)
    batch = get_object_or_404(Batch, pk=batch_id)
    students = Student.objects.filter(batch=batch)
    data = [{"id": student.id, "username": student.admin.username} for student in students]
    return Response({"branch": branch.branch_name, "batch": batch.template.name, "students": data})

@api_view(['GET'])
@permission_classes([AllowAny])
def manage_students(request, branch_id, batch_id):
    branch = get_object_or_404(Branches, pk=branch_id)
    batch = get_object_or_404(Batch, pk=batch_id)
    students = Student.objects.filter(batch=batch)
    data = [{"id": student.id, "username": student.admin.username} for student in students]
    return Response({"branch": branch.branch_name, "batch": batch.template.name, "students": data})

@api_view(['POST'])
@permission_classes([AllowAny])
def add_student_save(request, branch_id, batch_id):
    form = AddStudentForm(request.data, request.FILES)
    if form.is_valid():
        form.save()
        return Response({"message": "Student added successfully"}, status=201)
    else:
        return Response({"errors": form.errors}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def assign_staff(request):
    form = AssignStaffForm(request.data)
    if form.is_valid():
        form.save()
        return Response({"message": "Staff assigned successfully"}, status=201)
    else:
        return Response({"errors": form.errors}, status=400)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_assign(request, assignment_id):
    assignment = get_object_or_404(StaffBranchAssignment, id=assignment_id)
    assignment.delete()
    return Response({"message": "Assignment deleted successfully"})

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_diet_plan(request):
    form = DietPlanForm(request.data, request.FILES)
    if form.is_valid():
        form.save()
        return Response({"message": "Diet plan uploaded successfully"}, status=201)
    else:
        return Response({"errors": form.errors}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_batch(request):
    branch_id = request.data.get('branch_id')
    if branch_id:
        batches = Batch.objects.filter(branch_id=branch_id)
        data = [{"id": batch.id, "template_name": batch.template.name} for batch in batches]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"error": "Branch ID not provided"}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_student(request):
    branch_id = request.data.get('branch_id')
    batch_id = request.data.get('batch_id')
    if branch_id and batch_id:
        students = Student.objects.filter(branch_id=branch_id, batch_id=batch_id)
        data = [{"id": student.id, "username": student.admin.username} for student in students]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"error": "Branch ID or Batch ID not provided"}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def diet_plan_list(request):
    diet_plans = DietPlanAssignments.objects.select_related('diet_plan', 'student', 'branch', 'batch').all()
    data = [{"id": plan.id, "diet_plan": plan.diet_plan.name, "student": plan.student.admin.username, "branch": plan.branch.branch_name, "batch": plan.batch.template.name} for plan in diet_plans]
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def manage_staff(request):
    staffs = Staffs.objects.all()
    data = [
        {
            "id": staff.admin.id,
            "first_name": staff.admin.first_name,
            "last_name": staff.admin.last_name,
            "username": staff.admin.username,
            "email": staff.admin.email,
            "salary": staff.salary,  # Replacing 'salary' with 'salary'
            "last_login": staff.admin.last_login,
            "date_joined": staff.admin.date_joined
        }
        for staff in staffs
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def manage_branch(request):
    branches = Branches.objects.all()
    data = [{"id": branch.id, "branch_name": branch.branch_name} for branch in branches]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def manage_assign():
    assignments = StaffBranchAssignment.objects.select_related('staff', 'branch').all()
    data = [{"id": assignment.id, "staff": assignment.staff.admin.username, "branch": assignment.branch.branch_name} for assignment in assignments]
    return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def edit_staff_save(request):
    staff_id = request.data.get("staff_id")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    username = request.data.get("username")
    salary = request.data.get("salary")

    try:
        user = CustomUser.objects.get(id=staff_id)
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.username = username
        user.save()

        staff = user.staffs
        staff.salary = float(salary)
        staff.save()
        return Response({"message": "Staff updated successfully"})

    except CustomUser.DoesNotExist:
        return Response({"error": "Staff does not exist"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def edit_student_save(request):
    student_id = request.data.get("student_id")
    form = EditStudentForm(request.data, request.FILES)
    if form.is_valid():
        student = Student.objects.get(admin=student_id)
        student.admin.email = form.cleaned_data['email']
        student.admin.first_name = form.cleaned_data['first_name']
        student.admin.last_name = form.cleaned_data['last_name']
        student.admin.username = form.cleaned_data['username']
        student.gender = form.cleaned_data['gender']
        student.contact = form.cleaned_data['contact']
        student.dob = form.cleaned_data['dob']
        student.branch_id = form.cleaned_data['branch']
        student.batch_id = form.cleaned_data['batch']
        student.save()
        return Response({"message": "Student updated successfully"})
    else:
        return Response({"errors": form.errors}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def edit_assign_save(request):
    assign_id = request.data.get("assign_id")
    staff_id = request.data.get("staff")
    branch_id = request.data.get("branch")

    try:
        assignment = StaffBranchAssignment.objects.get(id=assign_id)
        staff = CustomUser.objects.get(id=staff_id)
        branch = Branches.objects.get(id=branch_id)
        assignment.staff = staff
        assignment.branch = branch
        assignment.save()

        return Response({"message": "Successfully Edited Assignment"})
    except Exception as e:
        return Response({"error": f"Failed to Edit Assignment: {str(e)}"}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def edit_branch(branch_id):
    branch = get_object_or_404(Branches, id=branch_id)
    return Response({"branch_name": branch.branch_name, "id": branch_id})

@api_view(['POST'])
@permission_classes([AllowAny])
def edit_branch_save(request):
    branch_id = request.data.get("branch_id")
    branch_name = request.data.get("branch")

    try:
        branch = Branches.objects.get(id=branch_id)
        branch.branch_name = branch_name
        branch.save()
        return Response({"message": "Successfully Edited Branch"})
    except Exception as e:
        return Response({"error": f"Failed to Edit Branch: {str(e)}"}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def delete_branch(branch_id):
    branch = get_object_or_404(Branches, id=branch_id)
    branch.delete()
    return Response({"message": "Successfully Deleted Branch"})

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email_exist(request):
    email = request.data.get("email")
    user_exists = CustomUser.objects.filter(email=email).exists()
    return Response({"exists": user_exists})

@api_view(['POST'])
@permission_classes([AllowAny])
def check_username_exist(request):
    username = request.data.get("username")
    user_exists = CustomUser.objects.filter(username=username).exists()
    return Response({"exists": user_exists})

@api_view(['GET'])
@permission_classes([AllowAny])
def staff_leave_view():
    leaves = LeaveReportStaff.objects.all()
    leave_data = [{"id": leave.id, "status": leave.leave_status, "date": leave.leave_date} for leave in leaves]
    return Response(leave_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_approve_leave(leave_id):
    leave = get_object_or_404(LeaveReportStaff, id=leave_id)
    leave.leave_status = 1
    leave.save()
    return Response({"message": "Leave approved successfully"})

@api_view(['POST'])
@permission_classes([AllowAny])
def staff_disapprove_leave(leave_id):
    leave = get_object_or_404(LeaveReportStaff, id=leave_id)
    leave.leave_status = 2
    leave.save()
    return Response({"message": "Leave disapproved successfully"})

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_view_attendance():
    branches = Branches.objects.all()
    branch_data = [{"id": branch.id, "name": branch.branch_name} for branch in branches]
    return Response(branch_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_get_batches(request):
    branch_id = request.data.get("branch_id")
    batches = Batch.objects.filter(branch_id=branch_id)
    batch_data = [{"id": batch.id, "name": str(batch)} for batch in batches]
    return Response(batch_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_get_attendance_dates(request):
    branch_id = request.data.get("branch_id")
    batch_id = request.data.get("batch_id")
    dates = Attendances.objects.filter(branch_id=branch_id, batch_id=batch_id)
    date_data = [{"id": date.id, "attendance_date": str(date.attendance_date), "attendance_time": str(date.attendance_time)} for date in dates]
    return Response(date_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_get_attendance_students(request):
    attendance_date = request.data.get("attendance_date")
    attendance = get_object_or_404(Attendances, id=attendance_date)

    # Fetch students in the selected batch
    students = Student.objects.filter(branch=attendance.branch, batch=attendance.batch)

    # Prepare data to be sent to the frontend
    list_data = []
    for student in students:
        attendance_records = AttendanceReport.objects.filter(student_id=student, attendance_id__branch=attendance.branch, attendance_id__batch=attendance.batch).count()
        data_small = {
            "id": student.admin.id,
            "name": f"{student.admin.first_name} {student.admin.last_name}",
            "status": AttendanceReport.objects.get(attendance_id=attendance, student_id=student).status,
            "session_count": attendance_records
        }
        list_data.append(data_small)

    return Response(list_data)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_profile(request):
    user = get_object_or_404(CustomUser, id=request.user.id)
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "username": user.username
    }
    return Response(user_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_profile_save(request):
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    password = request.data.get("password")

    try:
        customuser = CustomUser.objects.get(id=request.user.id)
        customuser.first_name = first_name
        customuser.last_name = last_name
        if password:
            customuser.set_password(password)
        customuser.save()
        return Response({"message": "Successfully Updated Profile"})
    except Exception as e:
        return Response({"error": f"Failed to Update Profile: {str(e)}"}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_send_notification_student():
    students = Student.objects.all()
    student_data = [{"id": student.id, "name": f"{student.admin.first_name} {student.admin.last_name}"} for student in students]
    return Response(student_data)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_send_notification_staff():
    staffs = Staffs.objects.all()
    staff_data = [{"id": staff.id, "name": f"{staff.admin.first_name} {staff.admin.last_name}"} for staff in staffs]
    return Response(staff_data)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_student_notification(request):
    id = request.data.get("id")
    message = request.data.get("message")
    student = get_object_or_404(Student, admin=id)
    token = student.fcm_token
    url = "https://fcm.googleapis.com/fcm/send"
    body = {
        "notification": {
            "title": "Student Management System",
            "body": message,
            "click_action": "https://studentmanagementsystem22.herokuapp.com/student_all_notification",
            "icon": "http://studentmanagementsystem22.herokuapp.com/static/dist/img/user2-160x160.jpg"
        },
        "to": token
    }
    headers = {"Content-Type": "application/json", "Authorization": "key=SERVER_KEY_HERE"}
    data = requests.post(url, data=json.dumps(body), headers=headers)
    notification = NotificationStudent(student_id=student, message=message)
    notification.save()
    return Response({"message": "Notification sent successfully", "response": data.text})


@api_view(['POST'])
@permission_classes([AllowAny])
def send_staff_notification(request):
    id = request.data.get("id")
    message = request.data.get("message")

    try:
        staff = Staffs.objects.get(admin=id)
        token = staff.fcm_token
        print("FCM Token:", token)  # Debug FCM token

        url = "https://fcm.googleapis.com/fcm/send"
        body = {
            "notification": {
                "title": "Student Management System",
                "body": message,
                "click_action": "https://studentmanagementsystem22.herokuapp.com/staff_all_notification",
                "icon": "http://studentmanagementsystem22.herokuapp.com/static/dist/img/user2-160x160.jpg"
            },
            "to": token
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": "key=YOUR_ACTUAL_SERVER_KEY"
        }

        # Send the notification
        response = requests.post(url, data=json.dumps(body), headers=headers)

        print("FCM Response Status Code:", response.status_code)
        print("FCM Response Body:", response.json())  # Log the response body for debugging

        # Save notification in the database
        notification = NotificationStaffs(staff_id=staff, message=message)
        notification.save()

        return Response({"message": "Notification sent successfully!"}, status=status.HTTP_200_OK)

    except Staffs.DoesNotExist:
        return Response({"error": "Staff member not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error:", e)  # Log the error message
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def student_feedback_message(request, branch_id, batch_id):
    # Fetch the branch and batch objects
    branch = get_object_or_404(Branches, id=branch_id)
    batch = get_object_or_404(Batch, id=batch_id)

    # Filter feedback based on branch and batch
    students = Student.objects.filter(branch=branch, batch=batch)
    feedbacks = FeedBackStudents.objects.filter(student_id__in=students).select_related('staff_id', 'student_id')

    feedback_list = [
        {
            "id": feedback.id,
            "student": {
                "id": feedback.student_id.id,
                "name": feedback.student_id.get_full_name(),
            },
            "staff": {
                "id": feedback.staff_id.id,
                "name": feedback.staff_id.get_full_name(),
            },
            "feedback": feedback.feedback,
            "feedback_reply": feedback.feedback_reply,
            "created_at": feedback.created_at,
        }
        for feedback in feedbacks
    ]

    return Response({
        "feedbacks": feedback_list,
        "branch": {"id": branch.id, "name": branch.branch_name},
        "batch": {"id": batch.id, "name": batch.batch_name},
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def student_feedback_message_replied(request):
    feedback_id = request.data.get("id")
    feedback_message = request.data.get("message")

    try:
        feedback = FeedBackStudents.objects.get(id=feedback_id)
        feedback.feedback_reply = feedback_message
        feedback.save()
        return Response({"success": "Feedback reply saved successfully."}, status=status.HTTP_200_OK)
    except FeedBackStudents.DoesNotExist:
        return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)