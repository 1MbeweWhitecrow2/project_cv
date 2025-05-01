from rest_framework import viewsets
from .models import Stock, StockData
from .serializers import StockSerializer, StockDataSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, F, ExpressionWrapper, FloatField



class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockDataViewSet(viewsets.ModelViewSet):
    queryset = StockData.objects.all()  # Ustawiamy domyślny queryset
    serializer_class = StockDataSerializer

    def get_queryset(self):
        queryset = self.queryset  # lub StockData.objects.all()
        ticker = self.request.query_params.get('ticker')
        if ticker:
            queryset = queryset.filter(stock__ticker=ticker)
        return queryset


class ScatterPlotData(APIView):
    """
    API, które zwraca zagregowane dane dla scatter plot 3D.
    Dla każdego stocka liczone są:
      - avg_close: średnia cena zamknięcia (close_price)
      - avg_volume: średnia wartość volume
      - avg_range: średnia różnica (high_price - low_price)
    Jeśli w parametrze GET nie podamy tickers, zwracane są domyślne: KO, MSFT, BA, MMM, IBM.
    """
    def get(self, request, format=None):
        tickers_param = request.query_params.get('tickers')
        if tickers_param:
            tickers = tickers_param.split(',')
        else:
            tickers = ['KO', 'MSFT', 'BA', 'MMM', 'IBM']

        qs = StockData.objects.filter(stock__ticker__in=tickers)
        aggregated = qs.values('stock__ticker', 'stock__name', 'stock__sector').annotate(
            avg_close=Avg('close_price'),
            avg_volume=Avg('volume'),
            avg_range=Avg(ExpressionWrapper(F('high_price') - F('low_price'), output_field=FloatField()))
        )
        # Przekształcamy wynik na listę słowników z prostszymi kluczami
        data = []
        for item in aggregated:
            data.append({
                'ticker': item['stock__ticker'],
                'name': item['stock__name'],
                'sector': item['stock__sector'],
                'x': item['avg_close'],
                'y': item['avg_range'],
                'z': item['avg_volume']
            })
        return Response(data)