from rest_framework.routers import DefaultRouter
from . import views



router = DefaultRouter()
router.register(r'client', views.ClientView, base_name='client')
router.register(r'order', views.OrderView, base_name='order')
router.register(r'transportation', views.TransportationView, base_name='transportation')
router.register(r'task', views.TaskView, base_name='task')

urlpatterns = router.urls