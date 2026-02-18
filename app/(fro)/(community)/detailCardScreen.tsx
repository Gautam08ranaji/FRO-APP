import BodyLayout from "@/components/layout/BodyLayout";
import { ENDPOINTS } from "@/features/api/endpoints";
import { getMasterListApi } from "@/features/api/masterApi";
import {
  districtDropDown,
  stateDropDown,
} from "@/features/api/masterApiClient";

import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width, height } = Dimensions.get("window");

/* ------------ TYPES ------------ */
interface State {
  value: number;
  label: string;
}

interface District {
  value: number;
  label: string;
  stateId?: number;
}

interface Facility {
  id: number;
  name: string;
  descriptions: string;
  state: string;
  district: string;
  stateId: number;
  districtId: number;
  latLong: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactWebsite: string;
  contactEmail: string;
  type?: string;
  status?: "open" | "closed";
  distanceLabel?: string;
}

interface TabItem {
  id: string;
  label: string;
  apiEndpoint: string;
  i18nKey: string; // Added i18n key for translation
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

/* ------------ API ENDPOINT MAPPING ------------ */
const API_ENDPOINT_MAP: { [key: string]: string } = {
  AddHospitalMaster: "GetHospitalMasterList",
  AddDiagnosticCentre: "GetDiagnosticCentreList",
  AddPsychiatricClinics: "GetPsychiatricClinicsList",
  AddPalliativeCares: "GetPalliativeCaresList",
  AddBloodBank: "GetBloodBankList",
  AddOrganDonationOrg: "GetOrganDonationOrgList",
  AddCitizenHome: "GetCitizenHomeList",
  AddDayCareCentres: "GetDayCareCentreList",
  AddCaregiver: "GetCaregiversList",
  AddElderFriendlyProducts: "GetElderFriendlyProductList",
  AddCounsellingCentres: "GetCounsellingCentresList",
  AddNgoMaster: "GetNgoMasterList",
  AddFaq: "GetFaqList",
};

/* ------------ DATA KEY MAPPING ------------ */
const DATA_KEY_MAP: { [key: string]: string } = {
  GetHospitalMasterList: "hospitalMasterList",
  GetDiagnosticCentreList: "diagnosticCentres",
  GetPsychiatricClinicsList: "psychiatricClinics",
  GetPalliativeCaresList: "palliativeCares",
  GetBloodBankList: "bloodBanks",
  GetOrganDonationOrgList: "organDonationOrgs",
  GetCitizenHomeList: "citizenHomeList",
  GetDayCareCentreList: "dayCareCentres",
  GetCaregiversList: "caregivers",
  GetElderFriendlyProductList: "elderFriendlyProducts",
  GetCounsellingCentresList: "counsellingCentres",
  GetNgoMasterList: "ngoMasterList",
  GetFaqList: "faqList",
};

/* ------------ I18N KEY MAPPING FOR TABS ------------ */
const TAB_I18N_KEYS: { [key: string]: string } = {
  Hospitals: "tabs.hospitals",
  "Diagnostic Centres": "tabs.diagnosticCentres",
  "Psychiatric Clinic": "tabs.psychiatricClinic",
  "Palliative Care": "tabs.palliativeCare",
  "Blood Banks": "tabs.bloodBanks",
  "Organ Donation Organizations": "tabs.organDonationOrgs",
  "Elder Homes": "tabs.elderHomes",
  "Day Care Centres": "tabs.dayCareCentres",
  Caregivers: "tabs.caregivers",
  "Elder-friendly Products": "tabs.elderFriendlyProducts",
  "Counselling Centres": "tabs.counsellingCentres",
  NGOs: "tabs.ngos",
  FAQs: "tabs.faqs",
};

export default function DetailCardScreen() {
  const { theme } = useTheme();
  const auth = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  // Get category and tabs from params
  const category = params.category as string;
  const tabsFromParams = params.tabs as string;
  const availableTabs: TabItem[] = tabsFromParams
    ? JSON.parse(tabsFromParams)
    : [];

  // If no tabs provided, use default based on category with API endpoints
  const defaultTabs: { [key: string]: TabItem[] } = {
    health: [
      {
        id: "AddHospitalMaster",
        label: "Hospitals",
        apiEndpoint: "GetHospitalMasterList",
        i18nKey: "tabs.hospitals",
      },
      {
        id: "AddDiagnosticCentre",
        label: "Diagnostic Centres",
        apiEndpoint: "GetDiagnosticCentreList",
        i18nKey: "tabs.diagnosticCentres",
      },
      {
        id: "AddPsychiatricClinics",
        label: "Psychiatric Clinic",
        apiEndpoint: "GetPsychiatricClinicsList",
        i18nKey: "tabs.psychiatricClinic",
      },
      {
        id: "AddPalliativeCares",
        label: "Palliative Care",
        apiEndpoint: "GetPalliativeCaresList",
        i18nKey: "tabs.palliativeCare",
      },
      {
        id: "AddBloodBank",
        label: "Blood Banks",
        apiEndpoint: "GetBloodBankList",
        i18nKey: "tabs.bloodBanks",
      },
      {
        id: "AddOrganDonationOrg",
        label: "Organ Donation Organizations",
        apiEndpoint: "GetOrganDonationOrgList",
        i18nKey: "tabs.organDonationOrgs",
      },
    ],
    shelter: [
      {
        id: "AddCitizenHome",
        label: "Elder Homes",
        apiEndpoint: "GetCitizenHomeList",
        i18nKey: "tabs.elderHomes",
      },
    ],
    dayCare: [
      {
        id: "AddDayCareCentres",
        label: "Day Care Centres",
        apiEndpoint: "GetDayCareCentreList",
        i18nKey: "tabs.dayCareCentres",
      },
    ],
    elder: [
      {
        id: "AddCaregiver",
        label: "Caregivers",
        apiEndpoint: "GetCaregiversList",
        i18nKey: "tabs.caregivers",
      },
      {
        id: "AddElderFriendlyProducts",
        label: "Elder-friendly Products",
        apiEndpoint: "GetElderFriendlyProductList",
        i18nKey: "tabs.elderFriendlyProducts",
      },
    ],
    companionship: [
      {
        id: "AddCounsellingCentres",
        label: "Counselling Centres",
        apiEndpoint: "GetCounsellingCentresList",
        i18nKey: "tabs.counsellingCentres",
      },
    ],
    nutrition: [
      {
        id: "AddNgoMaster",
        label: "NGOs",
        apiEndpoint: "GetNgoMasterList",
        i18nKey: "tabs.ngos",
      },
      {
        id: "AddFaq",
        label: "FAQs",
        apiEndpoint: "GetFaqList",
        i18nKey: "tabs.faqs",
      },
    ],
    cultural: [
      {
        id: "AddNgoMaster",
        label: "NGOs",
        apiEndpoint: "GetNgoMasterList",
        i18nKey: "tabs.ngos",
      },
      {
        id: "AddFaq",
        label: "FAQs",
        apiEndpoint: "GetFaqList",
        i18nKey: "tabs.faqs",
      },
    ],
  };

  // Map the incoming tabs to include API endpoints and i18n keys
  const tabs =
    availableTabs.length > 0
      ? availableTabs.map((tab) => ({
          ...tab,
          apiEndpoint: API_ENDPOINT_MAP[tab.id] || "GetNgoMasterList",
          i18nKey: TAB_I18N_KEYS[tab.label] || `tabs.${tab.id}`,
        }))
      : defaultTabs[category] || [];

  const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentTabData, setCurrentTabData] = useState<Facility[] | FAQItem[]>(
    [],
  );

  // Filter states
  const [selectedStateId, setSelectedStateId] = useState<number | "all">("all");
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | "all">(
    "all",
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const authState = useAppSelector((state) => state.auth);
  // Modal states
  const [showStateModal, setShowStateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  // Dynamic data from API
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  // Get current tab's API endpoint
  const getCurrentApiEndpoint = () => {
    const currentTab = tabs.find((tab) => tab.label === activeTab);
    return currentTab?.apiEndpoint || "GetNgoMasterList";
  };

  // Check if current tab is FAQs
  const isFAQTab = () => {
    return activeTab === "FAQs";
  };

  // Get category title for i18n
  const getCategoryTitle = () => {
    const categoryMap: { [key: string]: string } = {
      health: "healthTitle",
      shelter: "shelterTitle",
      nutrition: "nutritionTitle",
      dayCare: "daycareTitle",
      elder: "elderProductsTitle",
      cultural: "culturalTitle",
      companionship: "companionshipTitle",
    };
    return t(`informationTab.${categoryMap[category] || "healthTitle"}`);
  };

  // Get translated tab label
  const getTranslatedTabLabel = (tab: TabItem) => {
    return t(`detailCardScreen.${tab.i18nKey}`) || tab.label;
  };

  // Get translated active tab label
  const getTranslatedActiveTabLabel = () => {
    const currentTab = tabs.find((tab) => tab.label === activeTab);
    return currentTab ? getTranslatedTabLabel(currentTab) : activeTab;
  };

  // Fetch data on focus and when dependencies change
  useFocusEffect(
    useCallback(() => {
      if (authState?.userId) {
        getStateDropDown();
        fetchData();
      }
    }, [authState?.userId, activeTab]),
  );

  // Fetch data when state/district selection changes
  useEffect(() => {
    if (authState?.userId && !isFAQTab()) {
      fetchData();
    }
  }, [selectedStateId, selectedDistrictId, authState?.userId, activeTab]);

  // Filter data when dependencies change
  useEffect(() => {
    filterData();
  }, [activeTab, allData, selectedStateId, selectedDistrictId, searchQuery, t]);

  // Update filtered districts when state changes
  useEffect(() => {
    if (selectedStateId === "all") {
      setFilteredDistricts(districts);
    } else {
      setFilteredDistricts(
        districts.filter((d) => d.stateId === selectedStateId),
      );
    }
  }, [selectedStateId, districts]);

  // Fetch data from API based on current tab
  const fetchData = async () => {
    try {
      setIsLoadingData(true);

      // Logical endpoint key (used for mapping)
      const endpointKey = getCurrentApiEndpoint();

      // Real backend URL
      const endpointUrl =
        endpointKey === "GetBloodBankList" ? "GetBloodBank/list" : endpointKey;

      const fullApiUrl = `${ENDPOINTS.COMMON.COMMON_API}${endpointUrl}`;

      const data = await getMasterListApi(fullApiUrl, {
        pageNumber: 1,
        pageSize: 100,
      });

      console.log(`API Response for ${endpointKey}:`, data?.data);

      if (data?.success) {
        // Correct data key lookup
        const dataKey = DATA_KEY_MAP[endpointKey] || "data";
        const dataList = data.data?.[dataKey] || [];

        // FAQ handling
        if (endpointKey === "GetFaqList") {
          const faqs: FAQItem[] = dataList.map((item: any) => ({
            id: item.id,
            question: item.question || "",
            answer: item.answer || "",
            category: item.category || "",
          }));

          setAllData(faqs);
          setCurrentTabData(faqs);
        } else {
          // Facility handling (including Blood Bank)
          const facilities: Facility[] = dataList.map((item: any) => ({
            id: item.id,
            name:
              item.name ||
              item.hospitalName ||
              item.centreName ||
              item.productName ||
              "",
            descriptions:
              item.discriptions ||
              item.description ||
              item.productDescription ||
              "",
            state: item.state || "",
            district: item.distrinct || item.district || "",
            stateId: item.stateId || 0,
            districtId: item.distrinctId || item.districtId || 0,
            latLong: item.latLong || "",
            address: item.address || "",
            contactName: item.contactName || "",
            contactPhone: item.contactPhone || item.phone || "",
            contactWebsite: item.contactWebsite || item.website || "",
            contactEmail: item.contactEmail || item.email || "",
            type: activeTab.toLowerCase(),
            status: "open",
            distanceLabel: "hospitalScreen.distanceAway",
          }));

          setAllData(facilities);
          setCurrentTabData(facilities);
        }
      } else {
        setAllData([]);
        setCurrentTabData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllData([]);
      setCurrentTabData([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const filterData = () => {
    let result = [];

    if (isFAQTab()) {
      // Filter FAQs
      let filtered = [...currentTabData] as FAQItem[];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            (faq.category && faq.category.toLowerCase().includes(query)),
        );
      }

      result = filtered;
    } else {
      // Filter facilities
      let filtered = [...currentTabData] as Facility[];

      // Filter by state
      if (selectedStateId !== "all") {
        filtered = filtered.filter(
          (facility) => facility.stateId === selectedStateId,
        );
      }

      // Filter by district
      if (selectedDistrictId !== "all") {
        filtered = filtered.filter(
          (facility) => facility.districtId === selectedDistrictId,
        );
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (facility) =>
            facility.name.toLowerCase().includes(query) ||
            facility.address.toLowerCase().includes(query) ||
            facility.descriptions.toLowerCase().includes(query) ||
            facility.district.toLowerCase().includes(query) ||
            facility.state.toLowerCase().includes(query) ||
            facility.contactName.toLowerCase().includes(query) ||
            facility.contactPhone.toLowerCase().includes(query),
        );
      }

      result = filtered;
    }

    setFilteredData(result);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
    if (tab !== "FAQs") {
      setSelectedStateId("all");
      setSelectedDistrictId("all");
    }
  };

  const handleStateSelect = async (stateId: number | "all") => {
    setSelectedStateId(stateId);
    setSelectedDistrictId("all");

    // Load districts if a specific state is selected
    if (stateId !== "all") {
      await getDistrictDropDown(stateId);
    }

    setShowStateModal(false);
  };

  const handleDistrictSelect = (districtId: number | "all") => {
    setSelectedDistrictId(districtId);
    setShowDistrictModal(false);
  };

  const getSelectedStateName = () => {
    if (selectedStateId === "all") return t("detailCardScreen.allStates");
    const state = states.find((s) => s.value === selectedStateId);
    return state ? state.label : t("detailCardScreen.selectState");
  };

  const getSelectedDistrictName = () => {
    if (selectedDistrictId === "all") return t("detailCardScreen.allDistricts");
    const district = districts.find((d) => d.value === selectedDistrictId);
    return district ? district.label : t("detailCardScreen.selectDistrict");
  };

  const handleCall = (number: string) => Linking.openURL(`tel:${number}`);
  const handleOpen = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {
      // silent fail; optionally show toast
    });
  };

  const getStateDropDown = async () => {
    try {
      setIsLoadingStates(true);
      const res = await stateDropDown();
      if (res?.success && res?.data) {
        console.log("States loaded:", res.data);
        setStates(res.data);
      }
    } catch (error) {
      console.log("STATE API ERROR:", error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const getDistrictDropDown = async (stateId: number) => {
    try {
      setIsLoadingDistricts(true);
      const res = await districtDropDown(stateId);
      if (res?.success && res?.data) {
        console.log("Districts loaded:", res.data);
        const districtsWithStateId = res.data.map((district: District) => ({
          ...district,
          stateId,
        }));
        setDistricts((prevDistricts) => {
          const filtered = prevDistricts.filter((d) => d.stateId !== stateId);
          return [...filtered, ...districtsWithStateId];
        });
      }
    } catch (error) {
      console.log("DISTRICT API ERROR:", error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const renderStats = () => {
    if (isFAQTab()) return null;

    const totalInState =
      selectedStateId === "all"
        ? allData.length
        : allData.filter(
            (f: Facility) => (f as Facility).stateId === selectedStateId,
          ).length;

    const totalInDistrict =
      selectedDistrictId === "all"
        ? selectedStateId === "all"
          ? allData.length
          : allData.filter(
              (f: Facility) => (f as Facility).stateId === selectedStateId,
            ).length
        : allData.filter(
            (f: Facility) => (f as Facility).districtId === selectedDistrictId,
          ).length;

    return (
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.colors.colorPrimary50 },
          ]}
        >
          <Text
            style={[
              styles.statsTitle,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {selectedStateId === "all"
              ? t("detailCardScreen.totalNationwide")
              : t("detailCardScreen.facilitiesInState", {
                  state: getSelectedStateName(),
                })}
          </Text>
          <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
            {totalInState}
          </Text>
        </View>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.colors.colorPrimary50 },
          ]}
        >
          <Text
            style={[
              styles.statsTitle,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {selectedDistrictId === "all"
              ? t("detailCardScreen.allDistricts")
              : t("detailCardScreen.inDistrict", {
                  district: getSelectedDistrictName(),
                })}
          </Text>
          <Text style={[styles.statsValue, { color: theme.colors.primary }]}>
            {totalInDistrict}
          </Text>
        </View>
      </View>
    );
  };

  const renderFilterModal = (modalType: "state" | "district") => {
    const isStateModal = modalType === "state";
    const items = isStateModal
      ? [{ value: "all", label: t("detailCardScreen.allStates") }, ...states]
      : [
          { value: "all", label: t("detailCardScreen.allDistricts") },
          ...filteredDistricts,
        ];
    const isVisible = isStateModal ? showStateModal : showDistrictModal;
    const onSelect = isStateModal ? handleStateSelect : handleDistrictSelect;
    const currentId = isStateModal ? selectedStateId : selectedDistrictId;
    const isLoading = isStateModal ? isLoadingStates : isLoadingDistricts;

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          isStateModal ? setShowStateModal(false) : setShowDistrictModal(false)
        }
      >
        <TouchableWithoutFeedback
          onPress={() =>
            isStateModal
              ? setShowStateModal(false)
              : setShowDistrictModal(false)
          }
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.colorBgSurface },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: theme.colors.colorTextPrimary },
                  ]}
                >
                  {isStateModal
                    ? t("detailCardScreen.selectState")
                    : t("detailCardScreen.selectDistrict")}
                </Text>

                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={{ color: theme.colors.colorTextSecondary }}>
                      {t("detailCardScreen.loading")}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={items}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          item.value === currentId && {
                            backgroundColor: theme.colors.colorPrimary100,
                          },
                        ]}
                        onPress={() => onSelect(item.value as any)}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            { color: theme.colors.colorTextPrimary },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {item.value === currentId && (
                          <RemixIcon
                            name="check-line"
                            size={20}
                            color={theme.colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderFAQItem = (item: FAQItem) => {
    return (
      <View
        key={item.id}
        style={[
          styles.faqCard,
          { backgroundColor: theme.colors.colorBgSurface },
        ]}
      >
        <Text
          style={[styles.faqQuestion, { color: theme.colors.colorTextPrimary }]}
        >
          {item.question}
        </Text>

        <Text
          style={[styles.faqAnswer, { color: theme.colors.colorTextSecondary }]}
        >
          {item.answer}
        </Text>

        {item.category && (
          <View style={styles.faqCategory}>
            <Text
              style={[
                styles.faqCategoryText,
                { color: theme.colors.colorTextTertiary },
              ]}
            >
              {item.category}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFacilityItem = (item: Facility) => {
    return (
      <View
        key={item.id}
        style={[styles.card, { backgroundColor: theme.colors.colorBgSurface }]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, { color: theme.colors.colorTextPrimary }]}
          >
            {item.name}
          </Text>

          {item.status ? (
            <View
              style={[
                item.status === "open"
                  ? {
                      backgroundColor: theme.colors.validationWarningBg,
                    }
                  : {
                      backgroundColor: theme.colors.validationErrorBg,
                    },
                styles.statusBadge,
              ]}
            >
              <Text
                style={[
                  item.status === "open"
                    ? { color: theme.colors.validationWarningText }
                    : { color: theme.colors.validationErrorText },
                  styles.statusText,
                ]}
              >
                {item.status === "open"
                  ? t("detailCardScreen.open")
                  : t("detailCardScreen.closed")}
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={[
            styles.hospitalType,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {item.descriptions}
        </Text>

        {item.address ? (
          <>
            <View style={styles.addressRow}>
              <RemixIcon
                name="map-pin-line"
                size={18}
                color={theme.colors.colorTextSecondary}
              />
              <Text
                style={[
                  styles.addressText,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {item.address}
              </Text>
              <View style={styles.locationTags}>
                <Text
                  style={[
                    styles.locationTag,
                    { backgroundColor: theme.colors.colorPrimary100 },
                  ]}
                >
                  {item.district}
                </Text>
                <Text
                  style={[
                    styles.locationTag,
                    { backgroundColor: theme.colors.colorPrimary100 },
                  ]}
                >
                  {item.state}
                </Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <RemixIcon
                name="phone-line"
                size={16}
                color={theme.colors.colorTextSecondary}
              />
              <Text
                style={[
                  styles.contactText,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {item.contactPhone}
              </Text>
            </View>
          </>
        ) : null}

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: theme.colors.primary }]}
            onPress={() => handleViewDetails(item)}
          >
            <Text
              style={[styles.outlineBtnText, { color: theme.colors.primary }]}
            >
              {t("detailCardScreen.viewDetails")}
            </Text>
          </TouchableOpacity>

          {item.contactPhone ? (
            <TouchableOpacity
              style={[
                styles.callBtn,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleCall(item.contactPhone)}
            >
              <RemixIcon
                name="phone-line"
                size={20}
                color={theme.colors.btnPrimaryText}
              />
              <Text
                style={[
                  styles.callBtnText,
                  { color: theme.colors.btnPrimaryText },
                ]}
              >
                {t("detailCardScreen.call")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const handleViewDetails = (item: any) => {
    console.log("View details:", item);

    router.push({
      pathname: "/(fro)/(community)/Viewdetails",
      params: {
        item: JSON.stringify(item),
        tab: activeTab,
        category,
      },
    });
  };

  const renderItem = (item: any) => {
    if (isFAQTab()) {
      return renderFAQItem(item as FAQItem);
    } else {
      return renderFacilityItem(item as Facility);
    }
  };

  return (
    <BodyLayout type={"screen"} screenName="Detail Screen">
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryTitle, { color: theme.colors.primary }]}>
            {getCategoryTitle()}
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.colorPrimary600,
            },
          ]}
        >
          <RemixIcon
            name="search-line"
            size={20}
            color={theme.colors.colorTextSecondary}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme.colors.colorTextPrimary },
            ]}
            placeholder={
              isFAQTab()
                ? t("detailCardScreen.searchFAQPlaceholder")
                : t("detailCardScreen.searchPlaceholder", {
                    category: getTranslatedActiveTabLabel(),
                  })
            }
            placeholderTextColor={theme.colors.colorTextSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <RemixIcon
                name="close-line"
                size={20}
                color={theme.colors.colorTextSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Buttons Row - Only show for non-FAQ tabs */}
        {!isFAQTab() && (
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
              onPress={() => setShowStateModal(true)}
              disabled={isLoadingStates}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: theme.colors.primary },
                ]}
              >
                {isLoadingStates
                  ? t("detailCardScreen.loading")
                  : getSelectedStateName()}
              </Text>
              <RemixIcon
                name="arrow-down-s-line"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
              onPress={() => setShowDistrictModal(true)}
              disabled={selectedStateId === "all" || isLoadingDistricts}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      selectedStateId === "all" || isLoadingDistricts
                        ? theme.colors.colorTextSecondary
                        : theme.colors.primary,
                  },
                ]}
              >
                {isLoadingDistricts
                  ? t("detailCardScreen.loading")
                  : getSelectedDistrictName()}
              </Text>
              <RemixIcon
                name="arrow-down-s-line"
                size={16}
                color={
                  selectedStateId === "all" || isLoadingDistricts
                    ? theme.colors.colorTextSecondary
                    : theme.colors.primary
                }
              />
            </TouchableOpacity>
          </View>
        )}

        {/* TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
          contentContainerStyle={styles.tabsContentContainer}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  {
                    borderColor: theme.colors.primary,
                  },
                  isActive && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => handleTabChange(tab.label)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.colors.primary },
                    isActive && {
                      color: theme.colors.btnPrimaryText,
                    },
                  ]}
                >
                  {getTranslatedTabLabel(tab)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {isLoadingData && (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.colorTextSecondary }}>
              {isFAQTab()
                ? t("detailCardScreen.loadingFAQs")
                : t("detailCardScreen.loadingFacilities")}
            </Text>
          </View>
        )}

        {/* STATS - Only show for non-FAQ tabs */}
        {!isLoadingData && !isFAQTab() && renderStats()}

        {/* DATA CARDS */}
        {!isLoadingData && filteredData.map((item) => renderItem(item))}

        {/* Empty State */}
        {!isLoadingData && filteredData.length === 0 && (
          <View style={styles.emptyState}>
            <RemixIcon
              name="search-line"
              size={60}
              color={theme.colors.colorTextSecondary}
            />
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {isFAQTab()
                ? t("detailCardScreen.noFAQsFound")
                : t("detailCardScreen.noResults")}
            </Text>
            {searchQuery && (
              <Text
                style={[
                  styles.emptyStateSubtext,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {t("detailCardScreen.adjustSearch")}
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      {renderFilterModal("state")}
      {renderFilterModal("district")}
    </BodyLayout>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 44,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabsScrollView: {
    marginHorizontal: 16,
  },
  tabsContentContainer: {
    paddingRight: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginVertical: 4,
    minHeight: 36,
    justifyContent: "center",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 16,
  },
  statsCard: {
    width: width * 0.415,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    minHeight: 90,
  },
  statsTitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  faqCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  faqCategory: {
    marginTop: 8,
  },
  faqCategoryText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  statusText: {
    fontWeight: "600",
    fontSize: 12,
  },
  hospitalType: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  addressText: {
    marginLeft: 6,
    marginRight: 8,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  locationTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: "auto",
  },
  locationTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    marginLeft: 4,
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  contactText: {
    marginLeft: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  distanceBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  distanceText: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  outlineBtnText: {
    fontWeight: "600",
    fontSize: 14,
  },
  callBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 44,
  },
  callBtnText: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 48,
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
