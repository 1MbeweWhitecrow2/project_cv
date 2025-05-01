from django.db import models

class Stock(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    sector = models.CharField(max_length=50)

    def __str__(self):
        return self.ticker


class StockData(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    date = models.DateField()

    open_price = models.FloatField()
    high_price = models.FloatField()
    low_price = models.FloatField()
    close_price = models.FloatField()
    volume = models.BigIntegerField(default=0)

    eps = models.DecimalField(max_digits=20, decimal_places=4, default=0)
    dividend_per_share = models.DecimalField(max_digits=15, decimal_places=4, default=0)
    repurchase_stock = models.DecimalField(max_digits=25, decimal_places=4, default=0)
    net_income = models.DecimalField(max_digits=25, decimal_places=4, default=0)
    normalized_income = models.DecimalField(max_digits=25, decimal_places=4, default=0)
    net_debt = models.DecimalField(max_digits=25, decimal_places=4, default=0)
    total_assets = models.DecimalField(max_digits=25, decimal_places=4, default=0)
    total_revenue = models.DecimalField(max_digits=25, decimal_places=4, default=0)

    open_price = models.FloatField()
    high_price = models.FloatField()
    low_price = models.FloatField()
    close_price = models.FloatField()
    volume = models.BigIntegerField(default=0)

    class Meta:
        unique_together = ("stock", "date")

    def __str__(self):
        return f"{self.stock.ticker} - {self.date}"

