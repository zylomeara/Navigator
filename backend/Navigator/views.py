from django.views import View
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

@method_decorator(ensure_csrf_cookie, name='dispatch')
class IndexView(View):
    template_name = 'Navigator/index.html'
    def get(self, request):
        context = {}
        response = render(request, self.template_name, context)
        return response