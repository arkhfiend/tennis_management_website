import pdfkit
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.db.models import Sum
from django.core.exceptions import ValidationError
import datetime

from student_management_app.models import (
    CustomUser, Student, Branches, Batch, AttendanceReport,
    StudentVideoAssignment, DietPlanAssignments, FeedBackStudents,
    Staffs, NotificationStudent, PaymentRecord
)

@api_view(['GET'])
def student_home(request):
    try:
        student_obj = get_object_or_404(Student, admin=request.user.id)
        attendance_reports = AttendanceReport.objects.filter(student_id=student_obj)
        total_sessions_attended = sum(report.sessions_attended for report in attendance_reports)
        unpaid_sessions = sum(report.unpaid_sessions for report in attendance_reports)
        recent_attendance_report = attendance_reports.order_by('-created_at').first()
        branch = get_object_or_404(Branches, id=student_obj.branch_id.id)
        batch = get_object_or_404(Batch, id=student_obj.batch_id.id)
        payment_due = total_sessions_attended >= 10 and (recent_attendance_report and not recent_attendance_report.is_fee_paid)
        recent_video = StudentVideoAssignment.objects.filter(student=student_obj).order_by('-assigned_at').first()
        recent_diet_plan = DietPlanAssignments.objects.filter(student=student_obj).order_by('-assigned_at').first()
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        "attendance_present": total_sessions_attended,
        "current_session": total_sessions_attended,
        "unpaid_sessions": unpaid_sessions,
        "branch": {"id": branch.id, "name": branch.branch_name},
        "batch": {"id": batch.id, "name": batch.batch_name},
        "payment_due": payment_due,
        "recent_video": recent_video.id if recent_video else None,
        "recent_diet_plan": recent_diet_plan.id if recent_diet_plan else None
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def student_view_attendance(request):
    student = get_object_or_404(Student, admin=request.user.id)
    return Response({"student": {"id": student.id, "name": student.get_full_name()}}, status=status.HTTP_200_OK)

@api_view(['POST'])
def student_view_attendance_post(request):
    try:
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        start_data_parse = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        end_data_parse = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    student = get_object_or_404(Student, admin=request.user.id)
    attendance_reports = AttendanceReport.objects.filter(
        attendance_id__attendance_date__range=(start_data_parse, end_data_parse),
        student_id=student,
        status=True
    )
    total_sessions_attended = attendance_reports.count()
    batch_sessions_required = student.batch.template.sessions
    fee_reminder = total_sessions_attended >= batch_sessions_required

    return Response({
        "attendance_reports": [{"id": report.id, "date": report.attendance_id.attendance_date} for report in attendance_reports],
        "total_sessions_attended": total_sessions_attended,
        "batch_sessions_required": batch_sessions_required,
        "fee_reminder": fee_reminder,
        "start_date": start_data_parse,
        "end_date": end_data_parse
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def student_diet_plans(request):
    student = get_object_or_404(Student, admin=request.user)
    assignments = DietPlanAssignments.objects.filter(student=student)
    return Response({"assignments": [{"id": assignment.id, "plan": assignment.plan} for assignment in assignments]}, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def student_videos(request):
    student = get_object_or_404(Student, admin=request.user)
    assignments = StudentVideoAssignment.objects.filter(student=student)
    return Response({"assignments": [{"id": assignment.id, "video": assignment.video} for assignment in assignments]}, status=status.HTTP_200_OK)

@api_view(['GET'])
def student_feedback(request):
    student = get_object_or_404(Student, admin=request.user.id)
    feedback_data = FeedBackStudents.objects.filter(student_id=student)
    staff_list = Staffs.objects.all()
    return Response({
        "feedback_data": [{"id": feedback.id, "feedback": feedback.feedback, "reply": feedback.feedback_reply} for feedback in feedback_data],
        "staff_list": [{"id": staff.id, "name": staff.get_full_name()} for staff in staff_list]
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def student_feedback_save(request):
    staff_id = request.data.get("staff_id")
    feedback_msg = request.data.get("feedback_msg")
    student = get_object_or_404(Student, admin=request.user.id)
    staff_member = get_object_or_404(Staffs, id=staff_id)

    try:
        feedback = FeedBackStudents(student_id=student, staff_id=staff_member, feedback=feedback_msg, feedback_reply="")
        feedback.save()
        return Response({"success": "Feedback sent successfully!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": f"Failed to send feedback: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def student_profile(request):
    user = get_object_or_404(CustomUser, id=request.user.id)
    student = get_object_or_404(Student, admin=user)
    return Response({
        "user": {"id": user.id, "first_name": user.first_name, "last_name": user.last_name, "email": user.email},
        "student": {"id": student.id, "address": student.address}
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def student_profile_save(request):
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    password = request.data.get("password")
    address = request.data.get("address")

    try:
        customuser = get_object_or_404(CustomUser, id=request.user.id)
        customuser.first_name = first_name
        customuser.last_name = last_name
        if password:
            customuser.set_password(password)
        customuser.save()

        student = get_object_or_404(Student, admin=customuser)
        student.address = address
        student.save()
        return Response({"success": "Successfully Updated Profile"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Failed to Update Profile: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def student_fcmtoken_save(request):
    token = request.data.get("token")
    try:
        student = get_object_or_404(Student, admin=request.user.id)
        student.fcm_token = token
        student.save()
        return Response({"success": "Token saved successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Failed to save token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def student_all_notification(request):
    student = get_object_or_404(Student, admin=request.user.id)
    notifications = NotificationStudent.objects.filter(student_id=student.id)
    return Response({"notifications": [{"id": notification.id, "message": notification.message} for notification in notifications]}, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def student_payment(request):
    student = get_object_or_404(Student, admin=request.user)
    batch = student.batch
    branch = student.branch
    attendance_reports = AttendanceReport.objects.filter(student_id=student)

    if not attendance_reports.exists():
        return Response({
            'error_message': 'No attendance record found for this student.',
            'total_sessions_attended': 0,
            'total_sessions_paid': 0,
            'unpaid_sessions': 0,
            'current_session': 0,
            'payment_blocks_due': 0,
            'payment_due': 0,
            'payments': [],
            'batch_fee': batch.template.fee
        }, status=status.HTTP_200_OK)

    total_sessions_attended = sum(report.sessions_attended for report in attendance_reports)
    current_session = total_sessions_attended % 10 or 0
    total_sessions_paid = PaymentRecord.objects.filter(student=student).aggregate(total_paid=Sum('sessions'))['total_paid'] or 0
    unpaid_sessions = total_sessions_attended - total_sessions_paid

    if unpaid_sessions < 0:
        unpaid_sessions = 0

    payment_blocks_due = (unpaid_sessions + 9) // 10
    payment_due = payment_blocks_due * batch.template.fee
    payments = PaymentRecord.objects.filter(student=student).order_by('-date')

    return Response({
        'total_sessions_attended': total_sessions_attended,
        'total_sessions_paid': total_sessions_paid,
        'unpaid_sessions': unpaid_sessions,
        'current_session': current_session,
        'payment_blocks_due': payment_blocks_due,
        'payment_due': payment_due,
        'payments': [{"id": payment.id, "amount": payment.amount, "date": payment.date} for payment in payments],
        'batch_fee': batch.template.fee
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
def student_payment_post(request):
    student = get_object_or_404(Student, admin=request.user)
    batch = student.batch
    branch = student.branch
    attendance_reports = AttendanceReport.objects.filter(student_id=student)

    total_sessions_attended = sum(report.sessions_attended for report in attendance_reports)
    total_sessions_paid = PaymentRecord.objects.filter(student=student).aggregate(total_paid=Sum('sessions'))['total_paid'] or 0
    unpaid_sessions = total_sessions_attended - total_sessions_paid

    if unpaid_sessions < 0:
        unpaid_sessions = 0

    payment_blocks_due = (unpaid_sessions + 9) // 10
    payment_due = payment_blocks_due * batch.template.fee

    if payment_blocks_due <= 0:
        return Response({"error": "No payment is due at the moment."}, status=status.HTTP_400_BAD_REQUEST)

    blocks_to_pay = 1
    amount = blocks_to_pay * batch.template.fee

    try:
        PaymentRecord.objects.create(
            student=student,
            batch=batch,
            branch=branch,
            amount=amount,
            date=timezone.now(),
            sessions=blocks_to_pay * 10
        )
        return Response({"success": "Payment recorded successfully."}, status=status.HTTP_201_CREATED)
    except ValidationError as e:
        return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@login_required
def download_receipt(request, payment_id):
    payment = get_object_or_404(PaymentRecord, id=payment_id, student=request.user.student)
    html = render_to_string('student_template/receipt.html', {'payment': payment})

    try:
        pdf = pdfkit.from_string(html, False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_{payment.id}.pdf"'
        return response
    except Exception as e:
        return Response({"error": f"Error generating receipt: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)