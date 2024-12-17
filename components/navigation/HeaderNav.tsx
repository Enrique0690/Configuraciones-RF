import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SearchBar from "@/components/navigation/SearchBar";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

interface RouteConfig {
  title: string | null;
  showAddButton?: boolean;
  navigate?: (router: any) => void;
}

function HeaderNav({ routeConfig, isSmallScreen }: { routeConfig: RouteConfig; isSmallScreen: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{routeConfig.title ? t(routeConfig.title) : ''}</Text>
        {routeConfig.showAddButton && routeConfig.navigate && (
          <TouchableOpacity
            onPress={() => routeConfig.navigate!(router)}
            style={styles.addButton}
          >
            <Ionicons name="add-circle-outline" size={28} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>
      {routeConfig.title !== "common.searchtitle" && isSmallScreen && (
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  addButton: {
    marginRight: 10,
  },
  searchBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    paddingVertical: 10,
  },
});

export default HeaderNav;
