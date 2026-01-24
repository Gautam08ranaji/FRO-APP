import BodyLayout from "@/components/layout/BodyLayout";
import { getCommonDocumentList } from "@/features/fro/complaints/getCommonDocumentList";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CommonDocument {
  id: number;
  documentName: string;
  documentType: string;
  documentDescription: string;
  documentSize: number;
  documentExtension: string;
  createdDate: string;
}

export default function CommonDocumentListScreen() {
  const { theme } = useTheme();

  const [documents, setDocuments] = useState<CommonDocument[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 10;
  const RELATED_TO_ID = 61;

  const loadDocuments = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getCommonDocumentList({
        pageNumber,
        pageSize: PAGE_SIZE,
        relatedToId: RELATED_TO_ID,
      });

      setDocuments((prev) =>
        pageNumber === 1 ? res.list : [...prev, ...res.list],
      );
      setTotal(res.totalRecords);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments(1);
  }, []);

  const loadMore = () => {
    if (documents.length < total && !loading) {
      loadDocuments(page + 1);
    }
  };

  const onAddDocument = () => {
    console.log("Add Document Pressed");
    // router.push("/documents/add"); // connect later
  };

  const renderItem = ({ item }: { item: CommonDocument }) => (
    <View style={styles.card}>
      <Ionicons name="document-text-outline" size={22} color="#555" />
      <View style={styles.info}>
        <Text style={styles.name}>{item.documentName}</Text>
        <Text style={styles.desc}>{item.documentDescription}</Text>
        <Text style={styles.meta}>
          {item.documentExtension} • {item.documentSize} bytes
        </Text>
      </View>
    </View>
  );

  return (
    <BodyLayout type="screen" screenName="Documents">
      {/* ---------- ADD DOCUMENT BUTTON ---------- */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme.colors.colorPrimary500 },
        ]}
        onPress={onAddDocument}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={20} color={theme.colors.colorBgSurface} />
        <Text
          style={[styles.addButtonText, { color: theme.colors.colorBgSurface }]}
        >
          Add Document
        </Text>
      </TouchableOpacity>

      {/* ---------- DOCUMENT LIST ---------- */}
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No documents found</Text> : null
        }
      />
    </BodyLayout>
  );
}
const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },

  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
