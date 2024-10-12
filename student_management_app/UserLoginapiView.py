from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UserLoginAPIView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # Implement your authentication logic here (e.g., using JWT)
        # Return a token in the response upon successful authentication
        return Response({'token': 'your_generated_token'})

class UserDetailAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

