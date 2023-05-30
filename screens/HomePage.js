import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { supabase as supabaseCostumer } from "../supabase/costumer";
import CardOrder from "./components/CardOrder";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { setIsAlreadyAccepted } from "../config/app-slice";

export default function HomePage() {
  const [ordersData, setOrdersData] = useState();

  const dispatch = useDispatch();

  const online = useSelector((state) => state.appSlice.isActive);
  const id = useSelector((state) => state.appSlice.id);
  const isAlreadyAccepted = useSelector(
    (state) => state.appSlice.isAlreadyAccepted
  );

  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabaseCostumer.from("orders").select("*");
      if (error) throw error;

      setOrdersData(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
      setOrdersData(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  return (
    <SafeAreaView className="px-6 pt-8 flex-1 justify-start -mt-12 items-start bg-white">
      {/* {isAlreadyAccepted && (
        <View className="absolute flex items-center justify-center z-[999] bg-black/50 w-screen h-screen">
          <View className="bg-white w-2/3 px-8 py-4 rounded justify-center items-center">
            <Text className="text-center leading-5 font-semibold">
              This order has already been accepted. Please refresh.
            </Text>
            <View className="mt-4 bg-red-100 rounded-full p-2">
              <Icon name="alert-circle-outline" color="#b91c1c" size={32} />
            </View>
            <TouchableOpacity
              onPress={() => dispatch(setIsAlreadyAccepted(false))}
              className="py-3 w-full bg-sky-500 mt-4 rounded"
            >
              <Text className="text-center font-semibold text-white">Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
      <View className="pt-16 pb-2 flex flex-row items-center justify-between w-full">
        <Text className="font-semibold text-lg">New Orders :</Text>
        <TouchableOpacity
          onPress={() => handleRefresh()}
          className="flex flex-row justify-center bg-sky-500 items-center space-x-2 px-3 py-1.5 rounded"
        >
          <Icon name="reload-circle-outline" size={24} color="#fff" />
          <Text className="font-semibold text-white">
            Click here to refresh
          </Text>
        </TouchableOpacity>
      </View>
      {online ? (
        <ScrollView>
          {ordersData?.map((order, key) => (
              <CardOrder {...order} key={key} />
            ))}
        </ScrollView>
      ) : (
        <View className="w-full h-full justify-center items-center">
          <View className="bg-yellow-400 -mt-52 flex flex-row items-center px-8 w-full py-4 rounded">
            <View className="mr-4">
              <Icon name="power" size={32} />
            </View>
            <View>
              <Text className="text-lg font-semibold">You are offline !</Text>
              <Text className="pb-2 text-gray-800 font-semibold">
                Go online to start accepting orders.
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
