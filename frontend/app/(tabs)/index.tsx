import { Image, StyleSheet, Platform, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GetExpense, GetUser, getFeedback } from "@/api/apiService";
import { useAuth0 } from "react-native-auth0";
import { useEffect, useState } from "react";
import { Collapsible } from '@/components/Collapsible';
import FormComponent from '@/components/ui/FormComponent';
import { ScrollView } from 'react-native';
import { expenseBill } from '@/api/apiInterface';
import { useRouter } from 'expo-router';





const checkUserExists = async (email: string) => {
  try {
    const userProfile = await GetUser(email);
    return userProfile;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export default function HomeScreen() {

  const { user } = useAuth0();
  const [Firstname, setFirstName] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState<expenseBill[]>([]);
  const [feedbackData, setFeedbackData] = useState<string>('');
  const router = useRouter();

  const goToNewPage = () => {
    router.push("/(transaction)/transactions")
  };


  useEffect(() => {
    if (user) {
      const Email = user.email ?? "";
      checkUserExists(Email)
        .then((userProfile) => {
          if (userProfile) {
            setId(userProfile._id);
            setFirstName(userProfile.firstname);
          }
          GetExpense(userProfile._id)
            .then((expenseData) => {
              if (expenseData) {
                setData(expenseData);
              }
            }
            ).catch((error) => {
              console.error("Error getting expense data:", error);
            });
          getFeedback(userProfile._id)
            .then((feedbackData) => {
              setFeedbackData(feedbackData.feedback);
            })
            .catch((error) => {
              console.error("Error getting feedback data:", error);
            });
        }
        )
        .catch((error) => {
          console.error("Error checking user existence:", error);
        });


    }
  }, [user]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/Moneymate.png')}
          style={styles.reactLogo}
          resizeMode="center"

        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi {Firstname} !</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText>Welcome to the Moneymate!</ThemedText>
      <ThemedText>Check you recent transaction and stay on top of your finances today!</ThemedText>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Budget Insights</ThemedText>
        <ThemedView style={styles.container}>
          <ThemedView style={{ backgroundColor: '#EEFCFF', padding: 16, borderRadius: 8 }}>
            <ThemedText >
              {feedbackData}
            </ThemedText>

          </ThemedView>

        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recent Transactions</ThemedText>
        <ThemedView style={styles.container}>
          {data.length > 0 ? (
            <ScrollView style={styles.formContainer}>
              {data.slice(0, 5).map((item) => (
                <FormComponent key={item._id} data={item} />
              ))}
            </ScrollView>
          ) : (
            <ThemedView style={styles.row}>
              <ThemedText>No history found</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView>
          <Pressable
            style={[styles.buttonShadowBox, styles.Button]}
            onPress={goToNewPage}
          >
            <ThemedText style={[styles.buttonText]}>See All</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  buttonShadowBox: {
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  buttonText: {
    color: "rgba(0, 0, 0, 0.65)",
    fontSize: 16,
    lineHeight: 35,
    textAlign: "center",
  },
  Button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#A1CEDC",
    borderRadius: 8,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#728e96",
    borderRadius: 8,
  },
  row: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 220,
    width: 290,
    top: 50,
    bottom: 0,
    left: '20%',
    position: 'absolute',
  },
});
