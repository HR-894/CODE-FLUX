import { Ionicons } from '@expo/vector-icons';
import type {
  Complaint,
  MenuItem,
  TimetableEntry,
} from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function ScreenHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  const colors = useColors();

  return (
    <View style={styles.header}>
      <View style={styles.headerRule}>
        <View style={[styles.headerDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      </View>
      <Text style={[styles.heading, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.headerCopy, { color: colors.mutedForeground }]}>{copy}</Text>
    </View>
  );
}

export function LoadingBlock({ height = 100 }: { height?: number }) {
  const colors = useColors();
  return (
    <View
      accessible
      accessibilityLabel="Loading"
      style={[styles.loading, { backgroundColor: colors.muted, height }]}
    />
  );
}

export function MetricTile({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const colors = useColors();
  return (
    <View style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.cardForeground + '12' }]}>
      <View style={[styles.metricIcon, { backgroundColor: colors.secondary }]}>
        <Ionicons name={icon} size={16} color={colors.foreground} />
      </View>
      <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.metricDetail, { color: colors.primary }]}>{detail}</Text>
    </View>
  );
}

export function ComplaintCard({
  complaint,
  compact = false,
}: {
  complaint: Complaint;
  compact?: boolean;
}) {
  const colors = useColors();
  const statusColor =
    complaint.severity === 'critical' || complaint.severity === 'high'
      ? colors.accent
      : colors.primary;

  return (
    <View style={[styles.complaintCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.priorityLine, { backgroundColor: statusColor }]} />
      <View style={styles.complaintContent}>
        <View style={styles.rowBetween}>
          <Text style={[styles.complaintTitle, { color: colors.foreground }]} numberOfLines={2}>
            {complaint.title}
          </Text>
          <Text style={[styles.priorityText, { color: statusColor }]}>
            {complaint.priorityLabel}
          </Text>
        </View>
        {!compact && (
          <Text style={[styles.complaintDescription, { color: colors.mutedForeground }]} numberOfLines={2}>
            {complaint.description}
          </Text>
        )}
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
            {complaint.location}
          </Text>
          <Text style={[styles.status, { color: colors.foreground }]}>
            {complaint.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function TimetableRow({ entry }: { entry: TimetableEntry }) {
  const colors = useColors();
  return (
    <View style={[styles.timetableRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.timeMark, { backgroundColor: entry.color }]} />
      <View style={styles.flex}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {entry.room} · {entry.instructor}
        </Text>
      </View>
      <Text style={[styles.time, { color: colors.foreground }]}>{entry.time}</Text>
    </View>
  );
}

export function MenuFeature({ item }: { item?: MenuItem }) {
  const colors = useColors();
  if (!item) {
    return <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Menu details are resting.</Text>;
  }
  return (
    <View style={[styles.menuFeature, { backgroundColor: colors.secondary }]}>
      <View style={[styles.menuIcon, { backgroundColor: colors.card }]}>
        <Ionicons name="restaurant-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.menuMeal, { color: colors.primary }]}>{item.meal}</Text>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>{item.title}</Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  icon,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: secondary ? colors.secondary : colors.primary,
          opacity: disabled ? 0.55 : pressed ? 0.78 : 1,
        },
      ]}
    >
      {disabled ? (
        <ActivityIndicator size="small" color={secondary ? colors.foreground : colors.primaryForeground} />
      ) : (
        <Ionicons name={icon} size={17} color={secondary ? colors.foreground : colors.primaryForeground} />
      )}
      <Text style={[styles.actionText, { color: secondary ? colors.foreground : colors.primaryForeground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: 10, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 22 },
  headerRule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerDot: { width: 7, height: 7, borderRadius: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heading: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  headerCopy: { fontSize: 15, lineHeight: 22 },
  loading: { borderRadius: 16, opacity: 0.8 },
  metric: { flex: 1, minWidth: 145, borderRadius: 16, borderWidth: 1, padding: 14, gap: 7 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricLabel: { fontSize: 12, fontWeight: '600' },
  metricValue: { fontSize: 25, fontWeight: '700', letterSpacing: -0.5 },
  metricDetail: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  complaintCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  priorityLine: { width: 5 },
  complaintContent: { flex: 1, padding: 15, gap: 8 },
  rowBetween: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  complaintTitle: { flex: 1, fontSize: 15, lineHeight: 20, fontWeight: '700' },
  priorityText: { fontSize: 10, fontWeight: '700', maxWidth: 92, textAlign: 'right' },
  complaintDescription: { fontSize: 13, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { flex: 1, fontSize: 12 },
  status: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  timetableRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1 },
  timeMark: { width: 4, height: 38, borderRadius: 4 },
  flex: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', lineHeight: 19 },
  time: { fontSize: 11, fontWeight: '700', maxWidth: 75, textAlign: 'right' },
  menuFeature: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuMeal: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  emptyText: { fontSize: 14, lineHeight: 21 },
  actionButton: { minHeight: 48, borderRadius: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionText: { fontSize: 14, fontWeight: '700' },
});