import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, query, limit, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { AppSettings, MenuItemCategory, ReviewSource, PostStatus } from './types';

export async function initializeApp() {
  // Ensure we can connect to Firestore
  try {
    // Recommended connection test
    await getDocFromServer(doc(db, 'settings', 'connection_test')).catch(() => {});

    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      const defaultSettings: AppSettings = {
        restaurant_name: "OYAH FOOD CENTER",
        opening_hours: {
          "Mon - Fri": "10:00 AM - 10:00 PM",
          "Sat - Sun": "11:00 AM - 11:00 PM"
        },
        address: "123 Flavor Street, Culinary City",
        phone: "+1 (555) 123-4567",
        email: "hello@oyahfood.com",
        theme_color: "#FF6B00",
        font: "Poppins"
      };
      await setDoc(doc(db, 'settings', 'global'), defaultSettings);
    }

    // Preload sample menu if empty
    const menuSnap = await getDocs(query(collection(db, 'menu_items'), limit(1)));
    if (menuSnap.empty) {
      await seedSampleData();
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.info("Initialization skip: Missing permissions to write. (Normal if not logged in as admin)");
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore is offline or database ID is incorrect. Please check firebase-applet-config.json");
    } else {
      console.error("Initialization error:", error);
    }
  }
}

// Function to seed sample data if needed (call from admin dashboard or first load)
export async function seedSampleData() {
  const sampleMenu = [
    {
      name: "Spicy Buffalo Wings",
      description: "Crispy chicken wings tossed in our signature spicy sauce.",
      price: 12.99,
      category: MenuItemCategory.STARTERS,
      image_url: "https://picsum.photos/seed/wings/400/300",
      is_popular: true,
      created_at: new Date().toISOString()
    },
    {
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with cheddar cheese, lettuce, and tomato.",
      price: 15.99,
      category: MenuItemCategory.MAIN_DISHES,
      image_url: "https://picsum.photos/seed/burger/400/300",
      is_popular: true,
      created_at: new Date().toISOString()
    }
  ];

  for (const item of sampleMenu) {
     await setDoc(doc(db, 'menu_items', item.name.toLowerCase().replace(/ /g, '-')), item);
  }
}
