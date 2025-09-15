import { Ionicons } from "@expo/vector-icons"
import {Tabs} from "expo-router"
 
export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "green",
      tabBarInactiveTintColor: "grey",
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: "black",
        height: 90,
        paddingBottom: 30,
        paddingTop: 10,
        backgroundColor: "#222",
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
      }
    }}
    >
      <Tabs.Screen 
      name="home"
      options={{
        title: "Home",
        tabBarIcon: ({ color, size}) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen 
      name="post"
      options={{
        title: "Post",
        tabBarIcon: ({ color, size}) => (
          <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
        ),
      }}
      />
      <Tabs.Screen 
      name="settings"
      options={{
        title: "Settings",
        tabBarIcon: ({ color, size}) => (
          <Ionicons name="settings-outline" size={size} color={color} />
        ),
      }}
      />
    </Tabs>
  )
}
