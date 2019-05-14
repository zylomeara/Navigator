import json
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout

# from MyProject.utils import encode_cookie



# Create your views here.

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
    # return HttpResponse('fine')

    if user is not None:
        if user.is_active:
            login(request, user)
            print('fine')
            response['logged'] = 'true'
            response.set_cookie('username', user.username)
            # response.set_cookie('username', encode_cookie(user.username))
            response.set_cookie('first_name', user.first_name)
            response.set_cookie('last_name', user.last_name)
            return response
            # return render(request, 'login/success.html')
        else:
            pass
            print('no')
            return HttpResponse('no')

            # return render(request, 'login/disabled.html')
    else:
        pass
        print('not')
        response['logged'] = 'false'
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
    if(user.is_authenticated):
        response['logged'] = 'true'
        response.set_cookie('username', (user.username))
        response.set_cookie(
            'first_name', (user.first_name))
        response.set_cookie('last_name', (user.last_name))
    else:
        response['logged'] = 'false'
        response.delete_cookie('username')
        response.delete_cookie('first_name')
        response.delete_cookie('last_name')
    return response
