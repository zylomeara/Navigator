import json
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

from .models import Admin, Manager, Courier
from django.contrib.auth.models import User

from rest_framework.viewsets import ModelViewSet
# from MyProject.utils import encode_cookie

from .serializers import AdminSerializer, CourierSerializer, ManagerSerializer



# Create your views here.

# class UserView(ModelViewSet):
#     model = User
#     serializer_class = User
#     # filter_backends = (QueryFilterBackend,)
#     permission_classes = ()
#     queryset = User.objects.all()


def login_view(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    # username = request.POST.get('login') # это для обычной формы HTML
    # password = request.POST.get('password')
    username = body['username']
    password = body['password']
    print(username, password)
    user = authenticate(username=username, password=password)
    response = HttpResponse()
    response['Access-Control-Allow-Origin'] = '*'
    response['Content-Type'] = 'application/json'
    response['charset'] = 'utf-8'
    # return HttpResponse('fine')

    if user is not None:
        if user.is_active:
            login(request, user)
            responseContent = {'logged': True}

            if hasattr(user, 'manager'):
                responseContent['position'] = 'manager'
                user = Manager.objects.get(id=user.id)
                responseContent['profile'] = ManagerSerializer(user).data
            elif hasattr(user, 'courier'):
                responseContent['position'] = 'courier'
                user = Courier.objects.get(id=user.id)
                responseContent['profile'] = CourierSerializer(user).data
            else:
                responseContent['position'] = 'admin'
                user = Admin.objects.get(id=user.id)
                responseContent['profile'] = AdminSerializer(user).data

            response.write(json.dumps(responseContent))
            # response.set_cookie('username', user.username)
            # response.set_cookie('username', encode_cookie(user.username))
            # response.set_cookie('first_name', user.first_name)
            # response.set_cookie('last_name', user.last_name)
            return response
            # return render(request, 'login/success.html')
        else:
            pass
            # print('no')
            return HttpResponse('no')

            # return render(request, 'login/disabled.html')
    else:
        pass
        # print('not')
        response.write(json.dumps({'logged': False}))
        response.delete_cookie('username')
        response.delete_cookie('first_name')
        response.delete_cookie('last_name')
        return response
        # return render(request, 'login/invalid.html')

def logout_view(request):
    logout(request)
    response = HttpResponse()
    response.delete_cookie('sessionid')
    response.delete_cookie('username')
    response.delete_cookie('first_name')
    response.delete_cookie('last_name')
    return response

# def islog_view(request):
#     response = HttpResponse()
#     if(request.COOKIES.get('sessionid')):
#         response['logged'] = 'true'
#         return response
#     else:
#         response['logged'] = 'false'
#         return response


def islog_view(request):
    user = request.user
    response = HttpResponse()
    response['Access-Control-Allow-Origin'] = '*'
    response['Content-Type'] = 'application/json'
    response['charset'] = 'utf-8'
    responseContent = {}
    if(user.is_authenticated):
        responseContent['logged'] = True

        if hasattr(user, 'manager'):
            responseContent['position'] = 'manager'
            user = Manager.objects.get(id=user.id)
            responseContent['profile'] = ManagerSerializer(user).data
        elif hasattr(user, 'courier'):
            responseContent['position'] = 'courier'
            user = Courier.objects.get(id=user.id)
            responseContent['profile'] = CourierSerializer(user).data
        else:
            responseContent['position'] = 'admin'
            user = Admin.objects.get(id=user.id)
            responseContent['profile'] = AdminSerializer(user).data

        response.write(json.dumps(responseContent))
        response.set_cookie('username', (user.username))
        # response.set_cookie(
        #     'first_name', (user.first_name))
        # response.set_cookie('last_name', (user.last_name))
    else:
        responseContent['logged'] = False
        response.write(json.dumps(responseContent))
        response.delete_cookie('username')
        response.delete_cookie('first_name')
        response.delete_cookie('last_name')
    return response


def register_view(request):
    response = HttpResponse()
    response['Access-Control-Allow-Origin'] = '*'
    response['Content-Type'] = 'application/json'
    response['charset'] = 'utf-8'
    responseContent = {}

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    position = body['position']

    if position == 'manager':
        pass
    elif position == 'courier':
        pass
    else:
        response.status_code = 404
        return response



class UserView(ModelViewSet):
    """A view for Django users"""
    # serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.request.data['position'] == 'courier':
            return CourierSerializer
        elif self.request.data['position'] == 'manager':
            return ManagerSerializer
        else:
            return AdminSerializer

    def get_queryset(self):
        if self.request.data['position'] == 'courier':
            return Courier
        elif self.request.data['position'] == 'manager':
            return Manager
        else:
            return Admin

class CourierView(ModelViewSet):
    serializer_class = CourierSerializer
    queryset = Courier.objects.all()

class ManagerView(ModelViewSet):
    serializer_class = ManagerSerializer
    queryset = Manager.objects.all()