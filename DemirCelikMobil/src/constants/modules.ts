export type ResourceKey =
|'customers'
| 'products'
| 'orders'
| 'campaigns'
| 'visits'
| 'payments'
| 'financial_risk';

export interface ModuleDef {
    key: ResourceKey;
    icon: string;
    title: string;
    subtitle: string;
    screen?: string;
}

// key değerleri backenddeki ResourcePermissions.java daki
// isimlerle birebir aynı olmak zorunda 

export const ALL_MODULES: ModuleDef[] = [
    {
        key: 'customers',
        icon: '👥',
        title: 'Müşteri cari kartları',
        subtitle: 'Bakiye, kredi limiti, şehir bazlı liste',
        screen: 'CustomerScreen',
    },
    {
    key: 'products',
    icon: '⚙️',
    title: 'Ürün Kataloğu',
    subtitle: 'Stok durumu ve ton bazlı fiyatlar',
    screen: 'ProductScreen',
  },
  {
    key: 'orders',
    icon: '📦',
    title: 'Sipariş / Teklif',
    subtitle: 'Yeni sipariş girişi ve durum takibi',
    screen: 'OrderScreen',
  },
  {
    key: 'campaigns',
    icon: '🏷️',
    title: 'Kampanyalar',
    subtitle: 'Aktif indirim ve fırsatlar',
    screen: 'CampaignScreen',
  },
  {
    key: 'visits',
    icon: '📍',
    title: 'Ziyaret Raporları',
    subtitle: 'Saha ziyaret geçmişi ve notlar',
    screen: 'VisitScreen',
  },
  {
    key: 'payments',
    icon: '💳',
    title: 'Ödeme Kayıtları',
    subtitle: 'Tahsilat Geçmişi',
    screen: 'PaymentScreen',
  },
  {
    key: 'financial_risk',
    icon: '💰',
    title: 'Finansal Risk Analizi',
    subtitle: 'Şirket geneli gecikmiş bakiye raporu',
    screen: 'FinancialRiskScreen',
  },
];