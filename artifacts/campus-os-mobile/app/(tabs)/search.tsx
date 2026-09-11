import { getGetSearchSuggestionsQueryKey, useGetSearchSuggestions } from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ScreenHeader } from '@/components/CampusUI';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState<string>('');
  const trimmed = query.trim();
  const suggestions = useGetSearchSuggestions(
    { q: trimmed },
    { query: { enabled: trimmed.length > 0, queryKey: getGetSearchSuggestionsQueryKey({ q: trimmed }) } },
  );

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 96 }]} keyboardShouldPersistTaps="handled">
      <ScreenHeader eyebrow="Campus index" title="Find your place." copy="Search the living reference layer of campus: people, places, and events." />
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.primary} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Try library, advising, or north quad" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} autoCapitalize="none" autoCorrect={false} accessibilityLabel="Search campus" />
        {query.length > 0 && <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search"><Ionicons name="close-circle" size={19} color={colors.mutedForeground} /></Pressable>}
      </View>
      {!trimmed ? (
        <View style={[styles.idle, { backgroundColor: colors.secondary }]}>
          <Ionicons name="compass-outline" size={26} color={colors.primary} />
          <Text style={[styles.idleTitle, { color: colors.foreground }]}>Start with a campus signal.</Text>
          <Text style={[styles.idleCopy, { color: colors.mutedForeground }]}>Search for a building, a service, or tonight's event.</Text>
        </View>
      ) : suggestions.isLoading ? (
        <Text style={[styles.info, { color: colors.mutedForeground }]}>Searching the campus index…</Text>
      ) : suggestions.isError ? (
        <Text style={[styles.info, { color: colors.destructive }]}>Campus search is taking a moment.</Text>
      ) : suggestions.data?.length ? (
        <View style={styles.results}>{suggestions.data.map((item) => <Pressable key={item.id} onPress={() => setQuery(item.label)} style={({ pressed }) => [styles.result, { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><View style={[styles.resultIcon, { backgroundColor: colors.muted }]}><Ionicons name={item.kind === 'event' ? 'calendar-outline' : item.kind === 'directory' ? 'people-outline' : 'location-outline'} size={18} color={colors.primary} /></View><View style={styles.resultCopy}><Text style={[styles.resultLabel, { color: colors.foreground }]}>{item.label}</Text><Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>{item.meta}</Text></View><Text style={[styles.kind, { color: colors.primary }]}>{item.kind}</Text></Pressable>)}</View>
      ) : (
        <Text style={[styles.info, { color: colors.mutedForeground }]}>No campus references match that yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, gap: 16 },
  searchBox: { minHeight: 54, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  idle: { borderRadius: 18, padding: 22, gap: 9 },
  idleTitle: { fontSize: 18, fontWeight: '700' },
  idleCopy: { fontSize: 14, lineHeight: 20 },
  info: { fontSize: 14, paddingVertical: 12 },
  results: { gap: 0 },
  result: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1 },
  resultIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultCopy: { flex: 1, gap: 3 },
  resultLabel: { fontSize: 14, fontWeight: '700' },
  resultMeta: { fontSize: 12 },
  kind: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
});