import {
  getGetDashboardQueryKey,
  getListComplaintsQueryKey,
  useCreateComplaint,
  useExtractNextComplaint,
  useListComplaints,
  type CreateComplaintInput,
} from '@workspace/api-client-react';
import { ActionButton, ComplaintCard, LoadingBlock, ScreenHeader } from '@/components/CampusUI';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const initialForm: CreateComplaintInput = {
  title: '',
  description: '',
  category: 'facilities',
  severity: 'medium',
  location: '',
};

export default function ComplaintsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const complaints = useListComplaints({ status: 'open' });
  const create = useCreateComplaint();
  const extract = useExtractNextComplaint();
  const [form, setForm] = useState<CreateComplaintInput>(initialForm);
  const [showForm, setShowForm] = useState<boolean>(false);

  const update = <K extends keyof CreateComplaintInput>(key: K, value: CreateComplaintInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    if (form.title.trim().length < 5 || form.description.trim().length < 10 || form.location.trim().length < 2) {
      Alert.alert('A little more detail', 'Add a specific title, description, and location so the right team can respond.');
      return;
    }
    create.mutate(
      { data: { ...form, title: form.title.trim(), description: form.description.trim(), location: form.location.trim() } },
      {
        onSuccess: () => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setForm(initialForm);
          setShowForm(false);
          void queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey({ status: 'open' }) });
          void queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        },
        onError: () => Alert.alert('Could not submit', 'Check your connection and try again.'),
      },
    );
  };

  const claimNext = () => {
    extract.mutate(undefined, {
      onSuccess: (complaint) => {
        if (complaint) Alert.alert('Next priority', complaint.title);
        else Alert.alert('Queue clear', 'There are no open complaints right now.');
        void queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey({ status: 'open' }) });
      },
      onError: () => Alert.alert('Queue unavailable', 'Try again in a moment.'),
    });
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }]}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader eyebrow="Operations desk" title="Complaints, routed." copy="Make an issue visible, then let the campus route it by urgency." />
      <View style={styles.actions}>
        <ActionButton label="Find next priority" icon="locate-outline" onPress={claimNext} disabled={extract.isPending} secondary />
        <ActionButton label={showForm ? 'Close form' : 'New complaint'} icon={showForm ? 'close' : 'add'} onPress={() => setShowForm((value) => !value)} />
      </View>
      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Start a complaint</Text>
          <Text style={[styles.formCopy, { color: colors.mutedForeground }]}>Give the routing desk enough signal to send this to the right team.</Text>
          <Field label="What needs attention?" value={form.title} onChangeText={(value) => update('title', value)} placeholder="A short, specific title" />
          <Field label="Describe the issue" value={form.description} onChangeText={(value) => update('description', value)} placeholder="What happened?" multiline />
          <Field label="Where is this happening?" value={form.location} onChangeText={(value) => update('location', value)} placeholder="Building, room, or campus area" />
          <View style={styles.chips}>
            {(['facilities', 'academics', 'safety', 'it', 'dining'] as CreateComplaintInput['category'][]).map((category) => <Chip key={category} label={category} active={form.category === category} onPress={() => update('category', category)} />)}
          </View>
          <View style={styles.chips}>
            {(['low', 'medium', 'high', 'critical'] as CreateComplaintInput['severity'][]).map((severity) => <Chip key={severity} label={severity} active={form.severity === severity} onPress={() => update('severity', severity)} />)}
          </View>
          <ActionButton label={create.isPending ? 'Routing complaint' : 'Submit for routing'} icon="send-outline" onPress={submit} disabled={create.isPending} />
        </View>
      )}
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.foreground }]}>Open queue</Text>
        <Text style={[styles.count, { color: colors.primary }]}>{complaints.data?.length ?? 0} LIVE</Text>
      </View>
      {complaints.isLoading ? <LoadingBlock height={110} /> : complaints.isError ? <Text style={[styles.error, { color: colors.destructive }]}>Could not load the live queue.</Text> : complaints.data?.length ? complaints.data.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />) : <Text style={[styles.empty, { color: colors.mutedForeground }]}>The queue is clear.</Text>}
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} multiline={multiline} style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }, multiline && styles.multiline]} />
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Select ${label}`} style={({ pressed }) => [styles.chip, { backgroundColor: active ? colors.primary : colors.muted, opacity: pressed ? 0.75 : 1 }]}><Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, gap: 14 },
  actions: { flexDirection: 'row', gap: 9 },
  form: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  formTitle: { fontSize: 19, fontWeight: '700' },
  formCopy: { fontSize: 13, lineHeight: 18, marginTop: -5 },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700' },
  input: { minHeight: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14 },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { borderRadius: 100, paddingHorizontal: 12, paddingVertical: 8 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  listTitle: { fontSize: 18, fontWeight: '700' },
  count: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  error: { fontSize: 14, paddingVertical: 10 },
  empty: { fontSize: 14, paddingVertical: 10 },
});