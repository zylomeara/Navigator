# Generated by Django 2.2.1 on 2019-05-22 00:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
        ('orderapi', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='task',
            unique_together={('transportation', 'courier')},
        ),
    ]