from django import forms
from student_management_app.models import Batch, Branches, Student

class DateInput(forms.DateInput):
    input_type = "date"


class AddStudentForm(forms.Form):
    email = forms.EmailField(
        label="Email", max_length=50,
        widget=forms.EmailInput(attrs={"class": "form-control", "autocomplete": "off"})
    )
    password = forms.CharField(
        label="Password", max_length=50,
        widget=forms.PasswordInput(attrs={"class": "form-control"})
    )
    first_name = forms.CharField(
        label="First Name", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    last_name = forms.CharField(
        label="Last Name", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    username = forms.CharField(
        label="Username", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control", "autocomplete": "off"})
    )
    dob = forms.DateField(
        label="Date of Birth",
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"})
    )
    contact = forms.CharField(
        label="Contact", max_length=15,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    gender_choice = [
        ("Male", "Male"),
        ("Female", "Female")
    ]
    gender = forms.ChoiceField(
        label="Gender", choices=gender_choice,
        widget=forms.Select(attrs={"class": "form-control"})
    )
    profile_pic = forms.FileField(
        label="Profile Pic", max_length=50,
        widget=forms.FileInput(attrs={"class": "form-control"}),
        required=False
    )



class EditStudentForm(forms.Form):
    email = forms.EmailField(
        label="Email", max_length=50,
        widget=forms.EmailInput(attrs={"class": "form-control"})
    )
    first_name = forms.CharField(
        label="First Name", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    last_name = forms.CharField(
        label="Last Name", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    username = forms.CharField(
        label="Username", max_length=50,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    gender_choice = [
        ("Male", "Male"),
        ("Female", "Female")
    ]
    gender = forms.ChoiceField(
        label="Gender", choices=gender_choice,
        widget=forms.Select(attrs={"class": "form-control"})
    )
    contact = forms.CharField(
        label="Contact", max_length=15,
        widget=forms.TextInput(attrs={"class": "form-control"})
    )
    dob = forms.DateField(
        label="Date of Birth",
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"})
    )
    branch = forms.ModelChoiceField(
        queryset=Branches.objects.all(),
        label="Branch", widget=forms.Select(attrs={"class": "form-control"})
    )
    batch = forms.ModelChoiceField(
        queryset=Batch.objects.all(),
        label="Batch", widget=forms.Select(attrs={"class": "form-control"})
    )
    profile_pic = forms.FileField(
        label="Profile Pic", max_length=50,
        widget=forms.FileInput(attrs={"class": "form-control"}),
        required=False
    )

from django import forms
from .models import StaffBranchAssignment, Branches, CustomUser

# forms.py

from django import forms
from .models import StaffBranchAssignment, Branches, CustomUser

class AssignStaffForm(forms.ModelForm):
    class Meta:
        model = StaffBranchAssignment
        fields = ['staff', 'branch']
        widgets = {
            'staff': forms.Select(attrs={'class': 'form-control'}),
            'branch': forms.Select(attrs={'class': 'form-control'}),
        }

#DietPlan

from django import forms
from .models import DietPlans, Branches, Batch, Student

class DietPlanForm(forms.ModelForm):
    branch = forms.ModelChoiceField(queryset=Branches.objects.all(), label="Branch")
    batch = forms.ModelChoiceField(queryset=Batch.objects.all(), label="Batch", required=False)
    students = forms.ModelMultipleChoiceField(queryset=Student.objects.all(), widget=forms.CheckboxSelectMultiple, label="Students", required=False)

    class Meta:
        model = DietPlans
        fields = ['title', 'pdf', 'branch', 'batch', 'students']

#/DietPLan