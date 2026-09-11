import { useGetDashboard, useGetMenu, useGetTimetable, useListComplaints } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { ComplaintCard, LoadingBlock, MenuFeature, MetricTile, ScreenHeader, TimetableRow } from '@/components/CampusUI';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dashboard = useGetDashboard();
  const complaints = useListComplaints({ status: 'open' });
  const timetable = useGetTimetable();
  const menu = useGetMenu();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandLine}>
        <View style={[styles.brandMark, { backgroundColor: colors.foreground }]}>
          <Text style={[styles.brandLetter, { color: colors.background }]}>C</Text>
        </View>
        <Text style={[styles.brandName, { color: colors.foreground }]}>CampusOS</Text>
        <View style={styles.brandSpacer} />
        <Ionicons name="notifications-outline" size={21} color={colors.foreground} />
      </View>
      <ScreenHeader
        eyebrow="Tuesday · Campus pulse"
        title="Good morning, Aanya."
        copy="A clear view of what needs attention and what is already moving."
      />
      <View style={styles.metrics}>
        {dashboard.isLoading ? (
          <LoadingBlock height={130} />
        ) : (
          <>
            <MetricTile label="Active complaints" value={String(dashboard.data?.activeComplaints ?? 0)} detail="live queue" icon="chatbubble-ellipses-outline" />
            <MetricTile label="Attendance" value={`${dashboard.data?.attendanceRate ?? 0}%`} detail="this term" icon="calendar-outline" />
          </>
        )}
      </View>
      <View style={[styles.pulse, { backgroundColor: colors.foreground }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.pulseEyebrow, { color: colors.secondary }]}>CAMPUS PULSE</Text>
            <Text style={[styles.pulseTitle, { color: colors.card }]}>Your day is in motion.</Text>
          </View>
          <Ionicons name="pulse-outline" size={25} color={colors.secondary} />
        </View>
        <View style={styles.pulseBottom}>
          <Text style={[styles.pulseScore, { color: colors.card }]}>{dashboard.data?.attendanceRate ?? 94}<Text style={styles.pulsePercent}>%</Text></Text>
          <Text style={[styles.pulseCopy, { color: colors.muted }]}>{dashboard.data?.averageResponseHours ?? 3.8} hr average campus response</Text>
        </View>
      </View>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Needs your attention</Text>
        <Text style={[styles.sectionMeta, { color: colors.primary }]}>LIVE QUEUE</Text>
      </View>
      {complaints.isLoading ? <LoadingBlock height={92} /> : complaints.isError ? <Text style={[styles.error, { color: colors.destructive }]}>Campus queue unavailable right now.</Text> : complaints.data?.length ? complaints.data.slice(0, 2).map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} compact />) : <Text style={[styles.empty, { color: colors.mutedForeground }]}>The queue is clear.</Text>}
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Today on campus</Text>
        <Ionicons name="arrow-forward" size={17} color={colors.primary} />
      </View>
      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {timetable.isLoading ? <LoadingBlock height={100} /> : timetable.data?.map((entry) => <TimetableRow entry={entry} key={entry.id} />)}
      </View>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Dining context</Text>
        <Ionicons name="restaurant-outline" size={17} color={colors.accent} />
      </View>
      <MenuFeature item={menu.data?.[0]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, gap: 14 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 4 },
  brandMark: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brandLetter: { fontSize: 16, fontWeight: '800' },
  brandName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  brandSpacer: { flex: 1 },
  metrics: { flexDirection: 'row', gap: 10 },
  pulse: { borderRadius: 21, padding: 18, gap: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pulseEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  pulseTitle: { fontSize: 19, fontWeight: '700', marginTop: 6 },
  pulseBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  pulseScore: { fontSize: 42, fontWeight: '700', letterSpacing: -1 },
  pulsePercent: { fontSize: 18, fontWeight: '500' },
  pulseCopy: { flex: 1, fontSize: 12, lineHeight: 17, textAlign: 'right' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  sectionMeta: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  panel: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 14 },
  error: { fontSize: 14, paddingVertical: 14 },
  empty: { fontSize: 14, paddingVertical: 12 },
});