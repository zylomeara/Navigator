from django.views import View
from django.shortcuts import render

class IndexView(View):
    template_name = 'Navigator/index.html'
    def get(self, request):
        context = {}
        response = render(request, self.template_name, context)
        return response