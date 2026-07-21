import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

interface FieldMeta {
  field: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'DATE';
}

type AggFunction = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';

const AGG_FUNCTIONS: AggFunction[] = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = 70; 

const Chip: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const ReportBuilderScreen: React.FC = () => {
  const [resources, setResources] = useState<string[]>([]);
  const [resource, setResource] = useState<string>('orders');
  const [schema, setSchema] = useState<FieldMeta[]>([]);

  const [groupByField, setGroupByField] = useState<string>('');
  const [aggFunction, setAggFunction] = useState<AggFunction>('SUM');
  const [aggField, setAggField] = useState<string>('');

  const [dateField, setDateField] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [loadingSchema, setLoadingSchema] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ columns: string[]; rows: Record<string, any>[] } | null>(null);

  // Kaynak listesini bir kere çek
  useEffect(() => {
    api.get<string[]>('/reports/resources').then((res) => setResources(res.data)).catch(() => {});
  }, []);

  // Kaynak değiştikçe şemayı yeniden çek, seçimleri sıfırla
  useEffect(() => {
    if (!resource) return;
    setLoadingSchema(true);
    setResult(null);
    api
      .get<FieldMeta[]>(`/reports/schema/${resource}`)
      .then((res) => {
        setSchema(res.data);
        const firstString = res.data.find((f) => f.type === 'STRING');
        const firstNumber = res.data.find((f) => f.type === 'NUMBER');
        const firstDate = res.data.find((f) => f.type === 'DATE');
        setGroupByField(firstString?.field ?? '');
        setAggField(firstNumber?.field ?? '');
        setDateField(firstDate?.field ?? '');
        setStartDate('');
        setEndDate('');
      })
      .catch((error) => Alert.alert('Hata', `Şema alınamadı: ${error.message}`))
      .finally(() => setLoadingSchema(false));
  }, [resource]);

  const stringFields = schema.filter((f) => f.type === 'STRING');
  const numberFields = schema.filter((f) => f.type === 'NUMBER');
  const dateFields = schema.filter((f) => f.type === 'DATE');

  const runReport = useCallback(() => {
    if (!groupByField) {
      Alert.alert('Eksik Seçim', 'Lütfen bir "grupla" alanı seçin.');
      return;
    }
    if (aggFunction !== 'COUNT' && !aggField) {
      Alert.alert('Eksik Seçim', 'Lütfen toplanacak sayısal alanı seçin.');
      return;
    }

    const filters = [];
    if (dateField && startDate && endDate) {
      filters.push({ field: dateField, operator: 'BETWEEN', value: [startDate, endDate] });
    }

    setRunning(true);
    api
      .post('/reports/run', {
        resource,
        groupByField,
        aggregations: [
          {
            field: aggFunction === 'COUNT' ? groupByField : aggField,
            function: aggFunction,
            alias: 'value',
          },
        ],
        filters,
      })
      .then((res) => setResult(res.data))
      .catch((error) => {
        // 403/ACCESS_DENIED zaten api.ts interceptor'ı tarafından
        // "İzin İste" diyaloğuyla otomatik yakalanıyor; burada sadece
        // diğer hataları gösteriyoruz.
        if (error?.response?.status !== 403) {
          Alert.alert('Hata', `Rapor çalıştırılamadı: ${error.message}`);
        }
      })
      .finally(() => setRunning(false));
  }, [resource, groupByField, aggFunction, aggField, dateField, startDate, endDate]);

  const exportCsv = useCallback(async () => {
    if(!result || result.rows.length === 0) return;
    const header = result.columns.join(',');
    const lines = result.rows.map((row) =>
    result.columns
  .map((col) => {
    const v = row[col];
    const s = v === null || v === undefined ? '' : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  })
.join(',')
);
const csv = [header, ...lines].join('\n');

try {
  // React native'in kendi Share API'si - yeni bir native paket
  // gerekmez. Kullanıcı, açılan paylaşım menüsünden Gmail'e, Drive'a, Dosyalar'a ya da Whatsapp'a gönderebilir
  await Share.share({
    message: csv,
    title: `${resource}_raporu.csv`,
  });
} catch (e) {
  Alert.alert('Hata', 'Dışa aktarılamadı, tekrar deneyin');
}
  }, [result, resource]);

  const chartData =
    result && result.rows.length > 0
      ? {
          labels: result.rows.map((r) => String(r.group ?? '—').slice(0, 10)),
          datasets: [{ data: result.rows.map((r) => Number(r.value) || 0) }],
        }
      : null;

      // Kategori sayısına göre grafik genişliğini büyütürüz
      // Bu, etiketlerin üst üste binmesini önleyen asıl değişiklik. 
      // Az kategori varsa ekran genişliğini, çok kategori varsa (kategori * BAR_WIDTH) kullanıyoruz

      const chartWidth = chartData? Math.max(SCREEN_WIDTH - spacing.lg * 4, chartData.labels.length * BAR_WIDTH)
      : SCREEN_WIDTH;

   return (
    <View style={styles.root}>
      <HazardStripe />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Text style={typography.eyebrow}>DİNAMİK RAPOR</Text>
        <Text style={styles.title}>Rapor Oluşturucu</Text>
 
        <Text style={typography.label}>VERİ KAYNAĞI</Text>
        <View style={styles.chipRow}>
          {resources.map((r) => (
            <Chip key={r} label={r} active={resource === r} onPress={() => setResource(r)} />
          ))}
        </View>
 
        {loadingSchema ? (
          <ActivityIndicator color={colors.amber} style={{ marginTop: spacing.lg }} />
        ) : (
          <>
            <Text style={[typography.label, { marginTop: spacing.lg }]}>GRUPLA</Text>
            <View style={styles.chipRow}>
              {stringFields.map((f) => (
                <Chip key={f.field} label={f.label} active={groupByField === f.field} onPress={() => setGroupByField(f.field)} />
              ))}
            </View>
 
            <Text style={[typography.label, { marginTop: spacing.lg }]}>HESAPLA</Text>
            <View style={styles.chipRow}>
              {AGG_FUNCTIONS.map((fn) => (
                <Chip key={fn} label={fn} active={aggFunction === fn} onPress={() => setAggFunction(fn)} />
              ))}
            </View>
 
            {aggFunction !== 'COUNT' && (
              <>
                <Text style={[typography.label, { marginTop: spacing.lg }]}>ALAN</Text>
                <View style={styles.chipRow}>
                  {numberFields.map((f) => (
                    <Chip key={f.field} label={f.label} active={aggField === f.field} onPress={() => setAggField(f.field)} />
                  ))}
                </View>
              </>
            )}
 
            {dateFields.length > 0 && (
              <>
                <Text style={[typography.label, { marginTop: spacing.lg }]}>TARİH ARALIĞI (opsiyonel)</Text>
                <View style={styles.chipRow}>
                  {dateFields.map((f) => (
                    <Chip key={f.field} label={f.label} active={dateField === f.field} onPress={() => setDateField(f.field)} />
                  ))}
                </View>
                <View style={styles.dateRow}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD (başlangıç)"
                    placeholderTextColor={colors.textMuted}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD (bitiş)"
                    placeholderTextColor={colors.textMuted}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </>
            )}
 
            <TouchableOpacity style={styles.runButton} onPress={runReport} disabled={running}>
              <Text style={styles.runButtonText}>{running ? 'ÇALIŞIYOR…' : 'RAPORU OLUŞTUR'}</Text>
            </TouchableOpacity>
          </>
        )}
 
        {result && (
          <View style={styles.resultSection}>
            {chartData && (
              <View style={styles.chartCard}>
                {/* YATAY KAYDIRMA: çok kategori varsa grafik genişliyor,
                    kullanıcı parmağıyla sağa kaydırarak görüyor —
                    etiketler artık sıkışıp üst üste binmiyor. */}
                <ScrollView horizontal showsHorizontalScrollIndicator={chartData.labels.length > 5}>
                  <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={240}
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero
                    verticalLabelRotation={60}
                    chartConfig={{
                      backgroundColor: colors.surface,
                      backgroundGradientFrom: colors.surface,
                      backgroundGradientTo: colors.surface,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 122, 41, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(138, 147, 153, ${opacity})`,
                      barPercentage: 0.6,
                      propsForLabels: { fontSize: 10 },
                    }}
                    style={{ borderRadius: radii.md }}
                  />
                </ScrollView>
                {chartData.labels.length > 5 && (
                  <Text style={styles.scrollHint}>← kaydırarak tüm sonuçları görün →</Text>
                )}
              </View>
            )}
 
            <View style={styles.resultHeaderRow}>
              <Text style={typography.label}>SONUÇ TABLOSU ({result.rows.length} satır)</Text>
              <TouchableOpacity style={styles.exportButton} onPress={exportCsv}>
                <Text style={styles.exportButtonText}>📤 CSV Dışa Aktar</Text>
              </TouchableOpacity>
            </View>
 
            {result.rows.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableGroup} numberOfLines={2}>
                  {String(row.group ?? '—')}
                </Text>
                <Text style={styles.tableValue}>
                  {typeof row.value === 'number' ? row.value.toLocaleString('tr-TR') : String(row.value ?? '—')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
 
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs, marginBottom: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    backgroundColor: colors.surfaceInput,
  },
  chipActive: { borderColor: colors.amber, backgroundColor: '#2A2118' },
  chipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.amber, fontWeight: '800' },
  dateRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  dateInput: {
    flex: 1,
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  runButton: {
    backgroundColor: colors.amber,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  runButtonText: { color: colors.bg, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  resultSection: { marginTop: spacing.xl },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    ...shadow,
  },
  scrollHint: { ...typography.bodyMuted, fontSize: 10, marginTop: spacing.xs },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  exportButton: {
    borderWidth: 1,
    borderColor: colors.steelBlue,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  exportButtonText: { color: colors.steelBlue, fontSize: 11, fontWeight: '700' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  tableGroup: { color: colors.textPrimary, fontSize: 13, flex: 1, marginRight: spacing.sm },
  tableValue: { ...typography.mono, color: colors.amber, fontSize: 13, fontWeight: '700' },
});
 
export default ReportBuilderScreen;