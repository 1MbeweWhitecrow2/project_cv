# Generated by Django 5.1.6 on 2025-04-08 21:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="customuser",
            name="bio",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="profile_picture",
        ),
    ]
