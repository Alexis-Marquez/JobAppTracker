from django.db import models

from companies.models import Company
from locations.models import Location


class Interview(models.Model):
	location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
	company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
	notes = models.TextField(blank=True)
	interview_date = models.DateField(null=True, blank=True)
	def __str__(self):
		return f"{self.company} interview on {self.interview_date}"

class Question(models.Model):
	interview = models.ForeignKey(Interview, on_delete=models.SET_NULL, null=True, blank=True)
	question = models.TextField()

	class DifficultyLevel(models.IntegerChoices):
		EASY = 1, 'Easy'
		MEDIUM = 2, 'Medium'
		HARD = 3, 'Hard'

	difficulty = models.IntegerField(choices=DifficultyLevel.choices, null=True, blank=True)
	def __str__(self):
		return f"{self.question[:50]}..."
