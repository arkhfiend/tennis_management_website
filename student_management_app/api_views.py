
from django.core.files.storage import FileSystemStorage
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from student_management_app.models import CustomUser, Branches, Batch
from django.contrib.auth import login, logout


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .EmailBackEnd import EmailBackEnd

@api_view(['POST'])
@permission_classes([AllowAny])
def dologin(request):
    if request.method == "POST":
        email = request.data.get("email")
        password = request.data.get("password")

        # Create an instance of EmailBackEnd and call authenticate
        backend = EmailBackEnd()
        user = backend.authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'status': 'success',
                'user_type': user.user_type
            })
        else:
            return Response({'error': 'Invalid Login Details'}, status=400)

# Logout view
@api_view(['POST'])
@csrf_exempt
def logout_user(request):
    logout(request)
    return Response({'message': 'Logout successful', 'status': 'success'})

# Admin signup
@api_view(['POST'])
@csrf_exempt
def do_admin_signup(request):
    try:
        user = CustomUser.objects.create_user(
            username=request.data.get('username'),
            password=request.data.get('password'),
            email=request.data.get('email'),
            user_type=1
        )
        user.save()
        return Response({'message': 'Admin signup successful', 'status': 'success'})
    except Exception as e:
        return Response({'error': f'Failed to create admin: {e}'}, status=400)

# Staff signup
@api_view(['POST'])
@csrf_exempt
def do_staff_signup(request):
    try:
        user = CustomUser.objects.create_user(
            username=request.data.get('username'),
            password=request.data.get('password'),
            email=request.data.get('email'),
            user_type=2
        )
        user.staffs.salary = request.data.get('salary')
        user.save()
        return Response({'message': 'Staff signup successful', 'status': 'success'})
    except Exception as e:
        return Response({'error': f'Failed to create staff: {e}'}, status=400)

# Student signup
@api_view(['POST'])
@csrf_exempt
def do_signup_student(request):
    if request.method == "POST":
        try:
            profile_pic = request.FILES['profile_pic']
            fs = FileSystemStorage()
            filename = fs.save(profile_pic.name, profile_pic)
            profile_pic_url = fs.url(filename)

            user = CustomUser.objects.create_user(
                username=request.data.get('username'),
                password=request.data.get('password'),
                email=request.data.get('email'),
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                user_type=3
            )

            # Set the branch and batch for the student
            user.student.branch = get_object_or_404(Branches, id=request.data.get('branch'))
            user.student.batch = get_object_or_404(Batch, id=request.data.get('batch'))
            user.student.gender = request.data.get('gender')
            user.student.profile_pic = profile_pic_url
            user.save()

            return Response({'message': 'Student signup successful', 'status': 'success'})
        except Exception as e:
            return Response({'error': f'Failed to add student: {e}'}, status=400)

@api_view(['POST'])
def get_user_details(request):
    if request.user.is_authenticated:
        user_data = {
            'email': request.user.email,
            'user_type': str(request.user.user_type),  # Replace with actual user type field name
            # Optionally include other relevant user details here
        }
        return Response(user_data)
    else:
        return Response({'message': 'Please Login First'}, status=401)

# Get batches based on branch
@api_view(['POST'])
@csrf_exempt
def get_batches(request):
    branch_id = request.data.get('branch_id')
    if branch_id:
        batches = Batch.objects.filter(branch_id=branch_id).select_related('template').values('id', 'template__name')
        batch_list = [{'id': batch['id'], 'name': batch['template__name']} for batch in batches]
        return Response(batch_list, status=200)
    else:
        return Response([], status=400)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ImproperlyConfigured

# Assuming Firebase configuration is stored securely (e.g., environment variables)
import os

@api_view(['GET'])
def get_firebase_config(request):
    try:
        firebase_config = {
            'apiKey': os.environ.get('FIREBASE_API_KEY'),
            'authDomain': os.environ.get('FIREBASE_AUTH_DOMAIN'),
            # ... other Firebase configuration values
        }
        return Response(firebase_config)
    except ImproperlyConfigured:
        return Response({'error': 'Firebase configuration not found'}, status=400)
