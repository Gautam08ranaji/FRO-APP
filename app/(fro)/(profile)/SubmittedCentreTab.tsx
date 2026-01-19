import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

import {
  ApiAuthContext,
  getListStatic,
} from "@/features/fro/getKnowledgeListApi";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";

/* ================= TYPES ================= */

type ListItemType = "FAQ" | "NGO" | "HOSPITAL" | "PALLIATIVE";
type FilterType = "ALL" | "FAQ" | "NGO" | "HOSPITAL" | "PALLIATIVE";

interface ListItem {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  createdDate?: string;
  type: ListItemType;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  district?: string;
  state?: string;
}

/* ================= COMPONENT ================= */

export default function SubmittedCentreTab() {
  const { theme } = useTheme();
  const authState = useAppSelector((state) => state.auth);

  const [allItems, setAllItems] = useState<ListItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(false);

  /* ================= AUTH MEMO ================= */

  const apiAuth = useMemo<ApiAuthContext | null>(() => {
    if (!authState.token || !authState.antiforgeryToken) return null;

    return {
      bearerToken: authState.token,
      antiForgeryToken: authState.antiforgeryToken,
    };
  }, [authState.token, authState.antiforgeryToken]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!apiAuth || !authState.userId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const faqRes = await getListStatic({
          endpoint: "GetFaqList",
          auth: apiAuth,
          userId: authState.userId as string,
        });

        console.log("faqRes", faqRes?.data);

        const ngoRes = await getListStatic({
          endpoint: "GetNgoMasterList",
          auth: apiAuth,
          userId: authState.userId as string,
        });

        const hospitalListRes = await getListStatic({
          endpoint: "GetHospitalMasterList",
          auth: apiAuth,
          userId: authState.userId as string,
        });

        const palliativeListRes = await getListStatic({
          endpoint: "GetPalliativeCaresList",
          auth: apiAuth,
          userId: authState.userId as string,
        });
        const careGiverList = await getListStatic({
          endpoint: "GetcaregiversList",
          auth: apiAuth,
          userId: authState.userId as string,
        });

        console.log("careGiverList", careGiverList.data);

        if (!isMounted) return;

        const faqItems: ListItem[] =
          faqRes?.data?.faqs?.map((faq: any) => ({
            id: faq.id,
            title: faq.name,
            description: faq.description,
            createdDate: faq.createdDate,
            type: "FAQ",
          })) ?? [];

        const ngoItems: ListItem[] =
          ngoRes?.data?.ngoMasterList?.map((ngo: any) => ({
            id: String(ngo.id),
            title: ngo.name,
            description: ngo.discriptions,
            subtitle: `${ngo.distrinct}, ${ngo.state}`,
            type: "NGO",
          })) ?? [];

        const hospitalItems: ListItem[] =
          hospitalListRes?.data?.hospitalMasterList?.map((hospital: any) => ({
            id: String(hospital.id),
            title: hospital.name,
            description: hospital.discriptions,
            subtitle: `${hospital.distrinct || hospital.city || ""}`,
            address: hospital.address,
            contactPhone: hospital.contactPhone,
            contactEmail: hospital.contactEmail,
            type: "HOSPITAL",
          })) ?? [];

        const palliativeItems: ListItem[] =
          palliativeListRes?.data?.palliativeCares?.map((palliative: any) => ({
            id: String(palliative.id),
            title: palliative.name,
            description: palliative.description,
            subtitle: `${palliative.district || ""}, ${palliative.state || ""}`,
            address: palliative.address,
            contactPhone: palliative.contactPhone,
            contactEmail: palliative.contactEmail,
            district: palliative.district,
            state: palliative.state,
            createdDate: palliative.createdDate,
            type: "PALLIATIVE",
          })) ?? [];

        setAllItems([
          ...faqItems,
          ...ngoItems,
          ...hospitalItems,
          ...palliativeItems,
        ]);
      } catch (error) {
        console.error("❌ API error", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiAuth, authState.userId]);

  /* ================= FILTERING ================= */

  const filteredItems = useMemo(() => {
    if (filter === "ALL") return allItems;
    return allItems.filter((i) => i.type === filter);
  }, [allItems, filter]);

  const faqItems = useMemo(
    () => allItems.filter((i) => i.type === "FAQ"),
    [allItems],
  );

  const ngoItems = useMemo(
    () => allItems.filter((i) => i.type === "NGO"),
    [allItems],
  );

  const hospitalItems = useMemo(
    () => allItems.filter((i) => i.type === "HOSPITAL"),
    [allItems],
  );

  const palliativeItems = useMemo(
    () => allItems.filter((i) => i.type === "PALLIATIVE"),
    [allItems],
  );

  /* ================= UI CONFIG ================= */

  const uiConfig = {
    FAQ: {
      bg: theme.colors.validationInfoBg,
      iconBg: theme.colors.validationInfoText,
      icon: "question-line" as const,
      title: "FAQs",
    },
    NGO: {
      bg: theme.colors.validationSuccessBg,
      iconBg: theme.colors.validationSuccessText,
      icon: "community-line" as const,
      title: "NGOs",
    },
    HOSPITAL: {
      bg: "#E8F4FD",
      iconBg: "#0B69B3",
      icon: "hospital-line" as const,
      title: "Hospitals",
    },
    PALLIATIVE: {
      bg: "#F3E8FF",
      iconBg: "#8A2BE2",
      icon: "heart-pulse-line" as const,
      title: "Palliative Care",
    },
  };

  /* ================= UI COMPONENTS ================= */

  const SectionCard = ({
    title,
    children,
    type,
  }: {
    title: string;
    children: React.ReactNode;
    type: ListItemType;
  }) => {
    const ui = uiConfig[type];

    return (
      <View style={[styles.sectionCard, { backgroundColor: ui.bg }]}>
        {/* Section Header with Icon */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBox, { backgroundColor: ui.iconBg }]}>
            <RemixIcon
              name={ui.icon}
              size={16}
              color={theme.colors.colorBgSurface}
            />
          </View>
          <Text style={[styles.sectionTitle, { color: ui.iconBg }]}>
            {title}
          </Text>
        </View>

        {/* Section Content */}
        {children}
      </View>
    );
  };

  const ItemCard = ({ item }: { item: ListItem }) => {
    const ui = uiConfig[item.type];

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          {/* Left Icon */}
          <View style={[styles.iconBox, { backgroundColor: ui.iconBg }]}>
            <RemixIcon
              name={ui.icon}
              size={16}
              color={theme.colors.colorBgSurface}
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, { color: theme.colors.colorTextSecondary }]}
            >
              {item.title}
            </Text>

            {item.subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.colorTextTertiary },
                ]}
              >
                {item.subtitle}
              </Text>
            )}

            <Text
              style={[
                styles.description,
                { color: theme.colors.colorTextSecondary },
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            {/* Additional contact info for HOSPITAL and PALLIATIVE */}
            {(item.type === "HOSPITAL" || item.type === "PALLIATIVE") &&
              (item.contactPhone || item.address) && (
                <View style={styles.contactInfo}>
                  {item.contactPhone && (
                    <View style={styles.infoRow}>
                      <RemixIcon
                        name="phone-line"
                        size={12}
                        color={theme.colors.colorTextTertiary}
                      />
                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.colors.colorTextTertiary },
                        ]}
                      >
                        {item.contactPhone}
                      </Text>
                    </View>
                  )}
                  {item.address && (
                    <View style={styles.infoRow}>
                      <RemixIcon
                        name="map-pin-line"
                        size={12}
                        color={theme.colors.colorTextTertiary}
                      />
                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.colors.colorTextTertiary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.address}
                      </Text>
                    </View>
                  )}
                </View>
              )}
          </View>

          {/* Right Arrow */}
          <RemixIcon name="arrow-right-up-line" size={18} color={ui.iconBg} />
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({
    filterType,
    label,
    icon,
  }: {
    filterType: FilterType;
    label: string;
    icon: string;
  }) => {
    const isActive = filter === filterType;

    // Get UI configuration for the filter button
    const getFilterUI = () => {
      if (filterType === "ALL") {
        return {
          bg: theme.colors.colorPrimary600,
          iconColor: theme.colors.colorTextSecondary,
          textColor: theme.colors.colorTextSecondary,
        };
      } else {
        const ui = uiConfig[filterType];
        return {
          bg: ui.bg,
          iconColor: ui.iconBg,
          textColor: ui.iconBg,
        };
      }
    };

    const ui = getFilterUI();

    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive
              ? ui.iconColor
              : theme.colors.colorBgSurface,
            borderColor: isActive ? ui.iconColor : theme.colors.colorBorder,
          },
        ]}
        onPress={() => setFilter(filterType)}
      >
        {icon && (
          <RemixIcon
            name={icon as any}
            size={16}
            color={isActive ? theme.colors.colorBgSurface : ui.iconColor}
            style={styles.filterIcon}
          />
        )}
        <Text
          style={[
            styles.filterText,
            {
              color: isActive ? theme.colors.colorBgSurface : ui.textColor,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.colorPrimary600} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterRow}>
        <FilterButton filterType="ALL" label="All Items" icon="apps-line" />
        <FilterButton filterType="FAQ" label="FAQs" icon="question-line" />
        <FilterButton filterType="NGO" label="NGOs" icon="community-line" />
        <FilterButton
          filterType="HOSPITAL"
          label="Hospitals"
          icon="hospital-line"
        />
        <FilterButton
          filterType="PALLIATIVE"
          label="Palliative"
          icon="heart-pulse-line"
        />
      </View>

      {filter === "ALL" ? (
        <>
          {faqItems.length > 0 && (
            <SectionCard title="Frequently Asked Questions" type="FAQ">
              <View style={styles.itemsContainer}>
                {faqItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </View>
            </SectionCard>
          )}

          {ngoItems.length > 0 && (
            <SectionCard title="Non-Governmental Organizations" type="NGO">
              <View style={styles.itemsContainer}>
                {ngoItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </View>
            </SectionCard>
          )}

          {hospitalItems.length > 0 && (
            <SectionCard title="Hospitals" type="HOSPITAL">
              <View style={styles.itemsContainer}>
                {hospitalItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </View>
            </SectionCard>
          )}

          {palliativeItems.length > 0 && (
            <SectionCard title="Palliative Care Centers" type="PALLIATIVE">
              <View style={styles.itemsContainer}>
                {palliativeItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </View>
            </SectionCard>
          )}
        </>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <RemixIcon
                name="folder-line"
                size={48}
                color={theme.colors.colorBorder}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.colorTextTertiary },
                ]}
              >
                {filter === "FAQ"
                  ? "FAQs"
                  : filter === "NGO"
                    ? "NGOs"
                    : filter === "HOSPITAL"
                      ? "Hospitals"
                      : "Palliative Care Centers"}{" "}
                not found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#F7F9FC",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* Filters */
  filterRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    justifyContent: "center",
    marginBottom: 6,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "600",
  },

  /* Section */
  sectionCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemsContainer: {
    gap: 12,
  },

  /* Item Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },

  /* Contact Info */
  contactInfo: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  infoText: {
    fontSize: 11,
    marginLeft: 4,
  },

  /* List */
  listContent: {
    paddingBottom: 40,
    paddingTop: 4,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
