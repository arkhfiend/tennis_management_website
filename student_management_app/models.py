
from datetime import time
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.utils import timezone

# from django.core.exceptions import ValidationError
now = timezone.now()
# Create your models here.

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    user_type_data = (
        (1, "Admin"),
        (2, "Staff"),
        (3, "Student"),
    )
    user_type = models.CharField(default=1, choices=user_type_data, max_length=10)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Change this to a unique name
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Change this to a unique name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )

    def __str__(self):
        return self.username


class AdminHOD(models.Model):
    id=models.AutoField(primary_key=True)
    admin=models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)
    objects=models.Manager()

class Staffs(models.Model):
    id=models.AutoField(primary_key=True)
    admin=models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    salary = models.DecimalField(max_digits=10, decimal_places=2) #added New Field
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)
    fcm_token=models.TextField(default="")
    objects=models.Manager()


class Branches(models.Model):
    id=models.AutoField(primary_key=True)
    branch_name=models.CharField(max_length=255)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)
    objects=models.Manager()

    def __str__(self):
        return self.branch_name

class BatchTemplate(models.Model):
    """
    Model representing a batch template which is used across all branches.
    """
    RED = 'Red'
    BLUE = 'Blue'
    GREEN = 'Green'
    YELLOW = 'Yellow'

    BATCH_CHOICES = [
        (RED, 'Red Batch'),
        (BLUE, 'Blue Batch'),
        (GREEN, 'Green Batch'),
        (YELLOW, 'Yellow Batch'),
    ]

    name = models.CharField(max_length=6, choices=BATCH_CHOICES, unique=True)
    timing = models.TimeField()
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    sessions = models.PositiveIntegerField(default=10)
    tennis_time = models.DurationField(help_text="Duration of tennis coaching per session")
    fitness_time = models.DurationField(help_text="Duration of fitness coaching per session")
    days = models.CharField(max_length=50, help_text="Days when the batch meets, e.g., 'Mon, Wed, Fri'")

    def __str__(self):
        return f"{self.get_name_display()} Batch"

class Batch(models.Model):
    """
    Model representing a batch within a branch.
    """
    template = models.ForeignKey(BatchTemplate, on_delete=models.CASCADE, related_name='batches')
    branch = models.ForeignKey('Branches', on_delete=models.CASCADE, related_name='batches')
    objects=models.Manager()


    def __str__(self):
        return f"{self.template.get_name_display()} at {self.branch.branch_name}"

class StaffBranchAssignment(models.Model):
    staff = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 2})
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('staff', 'branch')

# class Student(models.Model):
#     id = models.AutoField(primary_key=True)
#     admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     gender = models.CharField(max_length=255)
#     dob = models.DateField(verbose_name="Date of Birth", null=True, blank=True)
#     contact = models.CharField(max_length=15, blank=True)
#     branch = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='students')
#     batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='students')
#     profile_pic = models.FileField(blank=True, upload_to='student_profiles/')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     fcm_token = models.TextField(default="")
#     objects = models.Manager()
#
#
#     def __str__(self):
#         return self.admin.username
#
#     def reset_sessions(self):
#         self.sessions_attended = 0
#         self.save()

class Student(models.Model):
    id = models.AutoField(primary_key=True)
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    gender = models.CharField(max_length=255)
    dob = models.DateField(verbose_name="Date of Birth", null=True, blank=True)
    contact = models.CharField(max_length=15, blank=True)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='students')
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='students')
    profile_pic = models.FileField(blank=True, upload_to='student_profiles/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    fcm_token = models.TextField(default="")
    # Add status for approval
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('disapproved', 'Disapproved'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    objects = models.Manager()

    def __str__(self):
        return self.admin.username


class Attendances(models.Model):
    id = models.AutoField(primary_key=True)
    branch = models.ForeignKey('Branches', on_delete=models.CASCADE)
    batch = models.ForeignKey('Batch', on_delete=models.CASCADE)
    attendance_date = models.DateField()
    attendance_time = models.TimeField(default=time(0, 0))  # To record time of attendance
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()


class AttendanceReport(models.Model):
    id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey(Student, on_delete=models.DO_NOTHING)
    attendance_id = models.ForeignKey(Attendances, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)  # Indicates if the student was present or absent
    sessions_attended = models.PositiveIntegerField(default=0)  # Tracks attended sessions
    unpaid_sessions = models.PositiveIntegerField(default=0)  # Tracks unpaid sessions
    is_fee_paid = models.BooleanField(default=True)  # Fee status
    grace_sessions = models.PositiveIntegerField(default=3)  # Maximum allowed unpaid sessions before restricting attendance
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()



    def handle_attendance(self, present):
        """
        Handles attendance, increments attended/unpaid sessions, and checks if fee payment is due.
        """
        if present:
            if self.is_fee_paid:
                self.sessions_attended += 1

                if self.sessions_attended >= 10:
                    self.is_fee_paid = False
                    self.unpaid_sessions = 0  # Reset unpaid sessions as payment becomes due
            else:
                self.unpaid_sessions += 1

                if self.unpaid_sessions > self.grace_sessions:
                    from student_management_app.api_StaffViews import notify_hod_about_unpaid_sessions
                    # Exceeded allowed unpaid sessions, notify HOD/admin
                    notify_hod_about_unpaid_sessions(self.student_id)

                # Optional: Notify student after every 3 unpaid sessions
                if self.unpaid_sessions % 3 == 0:
                    from student_management_app.api_StaffViews import send_fee_reminder_email
                    send_fee_reminder_email(self.student_id, unpaid=True)

        self.save()

    def reset_sessions(self):
        """
        Resets sessions when a payment is completed.
        """
        self.sessions_attended = 0
        self.unpaid_sessions = 0
        self.is_fee_paid = True
        self.save()

    def save(self, *args, **kwargs):
        """
        Ensure that unpaid_sessions doesn't go below 0.
        """
        if self.unpaid_sessions < 0:
            self.unpaid_sessions = 0
        super().save(*args, **kwargs)


#DietPlan
class DietPlans(models.Model):
    pdf = models.FileField(upload_to='diet_plans/')
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class DietPlanAssignments(models.Model):
    diet_plan = models.ForeignKey(DietPlans, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

#/DietPlan

#StudentVideoUpload
from django.db import models
from django.conf import settings

# Video Model
class StudentVideo(models.Model):
    video = models.FileField(upload_to='student_videos/')  # Upload location
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# Video Assignment Model
class StudentVideoAssignment(models.Model):
    video = models.ForeignKey(StudentVideo, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)  # Link to CustomUser (Student)
    branch = models.ForeignKey('Branches', on_delete=models.CASCADE)  # Assuming Branches is another model
    batch = models.ForeignKey('Batch', on_delete=models.CASCADE)  # Assuming Batch is another model
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video: {self.video.title} | Student: {self.student_id.username}"

#/StudentVideoUpload


class FeedBackStudents(models.Model):
    id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    staff_id = models.ForeignKey(Staffs, on_delete=models.CASCADE)
    feedback = models.TextField()
    feedback_reply = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()



class NotificationStudent(models.Model):
    id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()


class NotificationStaffs(models.Model):
    id = models.AutoField(primary_key=True)
    staff_id = models.ForeignKey(Staffs, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()

class LeaveReportStaff(models.Model):
    id = models.AutoField(primary_key=True)
    staff_id = models.ForeignKey(Staffs, on_delete=models.CASCADE)
    leave_date = models.CharField(max_length=255)
    leave_message = models.TextField()
    leave_status = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()


from django.core.exceptions import ValidationError


class PaymentRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    sessions = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"Payment of {self.amount} by {self.student.admin.username}"

    def save(self, *args, **kwargs):
        if self.amount <= 0:
            raise ValidationError("Payment amount must be positive.")
        super().save(*args, **kwargs)
        attendance_report = AttendanceReport.objects.get(student_id=self.student)
        attendance_report.reset_sessions()  # Reset sessions upon payment

class SalaryRecord(models.Model):
    coach = models.ForeignKey(Staffs, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Salary of {self.amount} to {self.coach.admin.username}"



@receiver(post_save, sender=Branches)
def create_batches_for_new_branch(sender, instance, created, **kwargs):
    if created:
        templates = BatchTemplate.objects.all()
        for template in templates:
            Batch.objects.create(template=template, branch=instance)



# @receiver(post_save, sender=CustomUser)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         if instance.user_type == 1:
#             AdminHOD.objects.create(admin=instance)
#         elif instance.user_type == 2:
#             Staffs.objects.create(admin=instance, address="")
#         elif instance.user_type == 3:
#             Student.objects.create(admin=instance, branch_id="", batch_id="", profile_pic="", gender="")

# Signal to create a staff profile when a CustomUser is created
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 1:
            AdminHOD.objects.create(admin=instance)
        elif instance.user_type == 2:
            Staffs.objects.create(admin=instance, salary=0)  # Initialize salary
        elif instance.user_type == 3:
            # Get default course and session year, replace with your logic
            branch = Branches.objects.first()  # Or set specific branch
            batch = Batch.objects.first()  # Or set specific batch
            Student.objects.create(
                admin=instance,
                branch=branch,
                batch=batch,
                profile_pic="",
                gender=""
            )

@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.user_type == 1:
        instance.adminhod.save()
    elif instance.user_type == 2:
        instance.staffs.save()
    elif instance.user_type == 3:
        instance.student.save()
