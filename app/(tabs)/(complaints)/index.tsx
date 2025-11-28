import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width } = Dimensions.get("window");

export default function CasesScreen() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = ["नए", "स्वीकृत", "रास्ते में", "कार्य जारी", "फॉलो-अप"];

    const data = [
        {
            name: "रामलाल शर्मा",
            age: 72,
            category: "स्वास्थ्य सहायता",
            ticket: "TKT-14567-001",
            distance: "2.3 km",
            time: "10 मिनट पहले मिला",
            status: 0,
            tag: "नया",
        },
        {
            name: "सीता देवी",
            age: 68,
            category: "पेंशन सहायता",
            ticket: "TKT-14567-002",
            distance: "5.1 km",
            time: "25 मिनट पहले मिला",
            status: 0,
            tag: "नया",
        },
        {
            name: "गोपाल कृष्ण",
            age: 75,
            category: "कानूनी सहायता",
            ticket: "TKT-14567-003",
            distance: "1.8 km",
            time: "1 घंटे पहले मिला",
            status: 0,
            tag: "नया",
        },
    ];

    const filteredData = data.filter((item) => item.status === activeTab);

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <RemixIcon name="arrow-left-line" size={22} color="#fff" />
                <Text style={styles.headerText}>मामले</Text>
            </View>

            {/* TABS */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
            >
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setActiveTab(index)}
                        activeOpacity={0.8}
                        style={[
                            styles.tab,
                            activeTab === index && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === index && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* LIST */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {filteredData.length === 0 ? (
                    <Text style={styles.noData}>कोई मामला उपलब्ध नहीं</Text>
                ) : (
                    filteredData.map((item, idx) => (
                        <View key={idx} style={styles.card}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.cardTitle}>{item.name}</Text>

                                <View style={styles.tagBadge}>
                                    <Text style={styles.tagText}>{item.tag}</Text>
                                </View>
                            </View>

                            <Text style={styles.cardText}>उम्र: {item.age}</Text>
                            <Text style={styles.cardText}>शिकायत श्रेणी: {item.category}</Text>
                            <Text style={styles.cardText}>टिकट नंबर: {item.ticket}</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <RemixIcon name="map-pin-line" size={16} color="#666" />
                                    <Text style={styles.metaText}>{item.distance} दूर</Text>
                                </View>

                                <View style={styles.metaItem}>
                                    <RemixIcon name="time-line" size={16} color="#666" />
                                    <Text style={styles.metaText}>{item.time}</Text>
                                </View>
                            </View>

                            <TouchableOpacity activeOpacity={0.85} style={styles.actionBtn}
                            onPress={()=>{
                              router.push('/CaseDetailScreen')
                            }}
                            >
                                <Text style={styles.actionBtnText}>मामला देखें</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // --------------- CONTAINER ---------------
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },

    // --------------- HEADER ---------------
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "android" ? 50 : 60,
        backgroundColor: "#027A61",
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 8,
    },

    // --------------- TABS ---------------
    tabContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    tab: {
        height: 38,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#EDEDED",
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#027A61",
        shadowColor: "#027A61",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    tabText: {
        fontSize: 14,
        color: "#323232",
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },

    // --------------- LIST ---------------
    listContainer: {
        paddingVertical: 10,
        paddingBottom: 90,
    },

    // --------------- CARD ---------------
    card: {
        width: width - 28,
        alignSelf: "center",
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 14,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginTop:10
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },
    cardText: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
    },

    // TAG
    tagBadge: {
        backgroundColor: "#2D8EFF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    // META ROW
    metaRow: {
        flexDirection: "row",
        marginTop: 12,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    metaText: {
        marginLeft: 4,
        color: "#666",
        fontSize: 13,
    },

    // CTA BUTTON
    actionBtn: {
        marginTop: 16,
        backgroundColor: "#027A61",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    actionBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    // NO DATA
    noData: {
        textAlign: "center",
        paddingTop: 40,
        fontSize: 16,
        color: "#777",
    },
});
