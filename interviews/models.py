from datetime import timedelta

from django.db import models

from applications.models import Application
from companies.models import Company
from locations.models import Location
from django.utils import timezone

class InterviewManager(models.Manager):
    def next_upcoming(self):
        return self.filter(
            interview_date__gte=timezone.localdate()
        ).order_by('interview_date').first()

    def upcoming(self):
        return self.filter(
            interview_date__gte=timezone.localdate()
        ).order_by('interview_date')

    def past(self):
        return self.filter(
            interview_date__lt=timezone.localdate()
        ).order_by('-interview_date')

    def for_company(self, company):
        return self.filter(company=company).order_by('interview_date')

    def interviews_this_week(self):
        today = timezone.localdate()
        end_of_week = today + timedelta(days=7)
        return self.filter(
            interview_date__gte=today,
            interview_date__lte=end_of_week
        ).order_by('interview_date')


class Interview(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    interview_date = models.DateField(null=True, blank=True)
    objects = InterviewManager()

    def __str__(self):
        return f"{self.company} interview on {self.interview_date}"

    def is_upcoming(self):
        return self.interview_date and self.interview_date >= timezone.localdate()

    def short_notes(self, char_limit=100):
        if len(self.notes) > char_limit:
            return f"{self.notes[:char_limit]}..."
        return self.notes

    def questions_count(self):
        return self.question_set.count()

    def get_easy_questions(self):
        return self.question_set.filter(difficulty=Question.DifficultyLevel.EASY)

    def get_medium_questions(self):
        return self.question_set.filter(difficulty=Question.DifficultyLevel.MEDIUM)

    def get_hard_questions(self):
        return self.question_set.filter(difficulty=Question.DifficultyLevel.HARD)

from django.db import models
from django.db.models import Count

class QuestionManager(models.Manager):
    def easy_questions(self):
        return self.filter(difficulty=Question.DifficultyLevel.EASY)

    def medium_questions(self):
        return self.filter(difficulty=Question.DifficultyLevel.MEDIUM)

    def hard_questions(self):
        return self.filter(difficulty=Question.DifficultyLevel.HARD)

    def questions_for_interview(self, interview):
        return self.filter(interview=interview)

    def count_by_difficulty(self):
        return self.values('difficulty').annotate(count=Count('id')).order_by('difficulty')


class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.SET_NULL, null=True, blank=True)
    question = models.TextField()
    objects = QuestionManager()

    class DifficultyLevel(models.IntegerChoices):
        EASY = 1, 'Easy'
        MEDIUM = 2, 'Medium'
        HARD = 3, 'Hard'

    difficulty = models.IntegerField(choices=DifficultyLevel.choices, null=True, blank=True)
    def __str__(self):
        return f"{self.question[:50]}..."

    def is_easy(self):
        return self.difficulty == self.DifficultyLevel.EASY

    def is_medium(self):
        return self.difficulty == self.DifficultyLevel.MEDIUM

    def is_hard(self):
        return self.difficulty == self.DifficultyLevel.HARD

    def short_question(self, char_limit=50):
        if len(self.question) > char_limit:
            return f"{self.question[:char_limit]}..."
        return self.question

from django.utils import timezone



