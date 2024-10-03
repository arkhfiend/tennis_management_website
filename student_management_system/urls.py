from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from student_management_app import api_views, api_HodViews, api_StaffViews, api_StudentViews
from student_management_system import settings

urlpatterns = [
path('api-auth/', include('rest_framework.urls')),
    path('api/signup_student/',api_views.do_signup_student,name="signup_student"),
    path('api/do_admin_signup',api_views.do_admin_signup,name="do_admin_signup"),
    path('api/do_staff_signup',api_views.do_staff_signup,name="do_staff_signup"),
    path('api/do_signup_student',api_views.do_signup_student,name="do_signup_student"),
    path('api/get_batches/', api_views.get_batches, name='get_batches_signup'),
    path('api/social-auth/', include('social_django.urls', namespace='social')),
    #/SignUpPart
    path('api/admin/', admin.site.urls),
    path('api/accounts/',include('django.contrib.auth.urls')),
    path('api/get_user_details', api_views.get_user_details),
    path('api/logout_user', api_views.logout_user,name="logout"),
    path('api/Login',api_views.dologin,name="do_login"),
    #hod_urls
    path('api/admin_home',api_HodViews.admin_home,name="admin_home"),
    path('api/add_staff_save',api_HodViews.add_staff_save,name="add_staff_save"),
    path('api/add_branch_save', api_HodViews.add_branch_save,name="add_branch_save"),
    path('api/delete_branch/<int:branch_id>/', api_HodViews.delete_branch, name='delete_branch'),
    #studentflow
    path('api/branches/', api_HodViews.branch_list, name='branch_list'),
    path('api/branches/<int:branch_id>/batches/', api_HodViews.batch_list, name='batch_list'),
    path('api/branch/<int:branch_id>/batch/<int:batch_id>/student-details/', api_HodViews.student_details,name='student_details'),
    path('api/branch/<int:branch_id>/batch/<int:batch_id>/add_student_save/', api_HodViews.add_student_save,name='add_student_save'),
    path('api/branch/<int:branch_id>/batch/<int:batch_id>/manage/', api_HodViews.manage_students,name='manage_students'),
    #studentflow
    path('api/assign_staff/', api_HodViews.assign_staff, name="assign_staff"),
    #DietPlan
    path('api/upload_diet_plan/', api_HodViews.upload_diet_plan, name='upload_diet_plan'),
    path('api/get_batches/', api_HodViews.get_batch, name='get_batch'),
    path('api/get_students/', api_HodViews.get_student, name='get_student'),
    path('api/diet_plan_list/', api_HodViews.diet_plan_list, name='diet_plan_list'),
    #/DietPlan
    path('api/delete_staff/<int:id>', api_HodViews.delete_staff, name='delete_staff'),
    path('api/delete_student/<int:id>/', api_HodViews.delete_student, name='delete_student'),
    path('api/delete_diet/<int:id>/', api_HodViews.delete_diet, name='delete_diet'),
    path('api/manage_staff', api_HodViews.manage_staff,name="manage_staff"),
    path('api/manage_students/<int:branch_id>/<int:batch_id>/', api_HodViews.manage_students, name='manage_students'),
    path('api/manage_branch', api_HodViews.manage_branch, name="manage_branch"),
    path('api/manage_assign', api_HodViews.manage_assign, name="manage_assign"),
    path('api/edit_staff_save', api_HodViews.edit_staff_save,name="edit_staff_save"),
    path('api/edit_student_save', api_HodViews.edit_student_save,name="edit_student_save"),
    path('api/delete-assign/<int:assignment_id>/', api_HodViews.delete_assign, name='delete_assign'),
    path('api/edit_assign_save/', api_HodViews.edit_assign_save, name='edit_assign_save'),
    # URLs for Editing Branches
    path('api/edit_branch_save', api_HodViews.edit_branch_save, name="edit_branch_save"),
    path('api/check_email_exist', api_HodViews.check_email_exist,name="check_email_exist"),
    path('api/check_username_exist', api_HodViews.check_username_exist,name="check_username_exist"),
    path('api/student_feedback_message', api_HodViews.student_feedback_message,name="student_feedback_message"),
    path('api/student_feedback_message_replied', api_HodViews.student_feedback_message_replied,name="student_feedback_message_replied"),
    path('api/staff_leave_view', api_HodViews.staff_leave_view,name="staff_leave_view"),
    path('api/staff_disapprove_leave/<str:leave_id>', api_HodViews.staff_disapprove_leave,name="staff_disapprove_leave"),
    path('api/staff_approve_leave/<str:leave_id>', api_HodViews.staff_approve_leave,name="staff_approve_leave"),
    #Admin_ViewAttendance
    path('api/admin_view_attendance', api_HodViews.admin_view_attendance,name="admin_view_attendance"),
    path('api/admin_get_batches', api_HodViews.admin_get_batches, name="admin_get_batches"),
    path('api/admin_get_attendance_dates', api_HodViews.admin_get_attendance_dates,name="admin_get_attendance_dates"),
    path('api/admin_get_attendance_student', api_HodViews.admin_get_attendance_students,name="admin_get_attendance_student"),
    #Admin_ViewAttendance
    path('api/admin_profile', api_HodViews.admin_profile,name="admin_profile"),
    path('api/admin_profile_save', api_HodViews.admin_profile_save,name="admin_profile_save"),
    path('api/admin_send_notification_staff', api_HodViews.admin_send_notification_staff,name="admin_send_notification_staff"),
    path('api/admin_send_notification_student', api_HodViews.admin_send_notification_student,name="admin_send_notification_student"),
    path('api/send_student_notification', api_HodViews.send_student_notification,name="send_student_notification"),
    path('api/send_staff_notification', api_HodViews.send_staff_notification,name="send_staff_notification"),




  #     Staff URL Path
    path('api/staff_home', api_StaffViews.staff_home, name="staff_home"),
    # path('api/get_batches_by_branch/', api_StaffViews.get_batches_by_branch, name='get_batches_by_branch'),
    # path('api/get_students_by_batch/', api_StaffViews.get_students_by_batch, name='get_students_by_batch'),
    #StudentUnderMe
    path('api/view-students', api_StaffViews.staff_view_students, name='staff_view_students'),
    path('api/get_batches_by_branch/', api_StaffViews.get_batches_by_branch, name='get_batches_by_branch'),
    path('api/get_students_by_branch_and_batch/', api_StaffViews.get_students_by_branch_and_batch,name='get_students_by_branch_and_batch'),
    #/StudentUnderMe
    path('api/staff_take_attendance', api_StaffViews.staff_take_attendance, name="staff_take_attendance"),
    path('api/staff_update_attendance', api_StaffViews.staff_update_attendance, name="staff_update_attendance"),
    path('api/get-batches/', api_StaffViews.get_batches, name='get_batches'),
    path('api/get_students', api_StaffViews.get_students, name="get_students"),
    path('api/get_attendance_dates', api_StaffViews.get_attendance_dates, name="get_attendance_dates"),
    path('api/get_attendance_student', api_StaffViews.get_attendance_student, name="get_attendance_student"),
    path('api/save_attendance_data', api_StaffViews.save_attendance_data, name="save_attendance_data"),
    path('api/save_updateattendance_data', api_StaffViews.save_updateattendance_data, name="save_updateattendance_data"),
    path('api/staff_apply_leave', api_StaffViews.staff_apply_leave, name="staff_apply_leave"),
    path('api/staff_apply_leave_save', api_StaffViews.staff_apply_leave_save, name="staff_apply_leave_save"),
    path('api/staff_profile', api_StaffViews.staff_profile, name="staff_profile"),
    path('api/staff_profile_save', api_StaffViews.staff_profile_save, name="staff_profile_save"),
    path('api/staff_fcmtoken_save', api_StaffViews.staff_fcmtoken_save, name="staff_fcmtoken_save"),
    path('api/staff_all_notification', api_StaffViews.staff_all_notification, name="staff_all_notification"),



    #Student
    path('api/student_home', api_StudentViews.student_home, name="student_home"),
    path('api/student_view_attendance', api_StudentViews.student_view_attendance, name="student_view_attendance"),
    path('api/student_view_attendance_post', api_StudentViews.student_view_attendance_post, name="student_view_attendance_post"),
    #ViewDiet
    path('api/my_diet_plans/', api_StudentViews.student_diet_plans, name='student_diet_plans'),
    #/ViewDiet
    path('api/student_feedback', api_StudentViews.student_feedback, name="student_feedback"),
    path('api/student_feedback_save', api_StudentViews.student_feedback_save, name="student_feedback_save"),
    path('api/student_profile', api_StudentViews.student_profile, name="student_profile"),
    path('api/student_profile_save', api_StudentViews.student_profile_save, name="student_profile_save"),
    path('api/student_fcmtoken_save', api_StudentViews.student_fcmtoken_save, name="student_fcmtoken_save"),
    path('api/firebase-messaging-sw.js',api_views.get_firebase_config,name="show_firebase_js"),
    path('api/student_all_notification',api_StudentViews.student_all_notification,name="student_all_notification")
#/Student
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)+static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
