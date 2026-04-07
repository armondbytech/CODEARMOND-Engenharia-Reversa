import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { QRConfig, defaultConfig, QRCodeConfig } from '../types';
import { auth, db, onAuthStateChanged, User, onSnapshot, collection, doc, setDoc, Timestamp, OperationType, handleFirestoreError } from '../lib/firebase';

interface QRContextType {
  config: QRConfig;
  user: User | null;
  history: QRCodeConfig[];
  isAuthReady: boolean;
  updateConfig: (newConfig: Partial<QRConfig>) => void;
  updateDotsOptions: (options: Partial<QRConfig['dotsOptions']>) => void;
  updateCornersSquareOptions: (options: Partial<QRConfig['cornersSquareOptions']>) => void;
  updateCornersDotOptions: (options: Partial<QRConfig['cornersDotOptions']>) => void;
  updateImageOptions: (options: Partial<QRConfig['imageOptions']>) => void;
  saveToHistory: (name: string) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export const QRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<QRConfig>(defaultConfig);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<QRCodeConfig[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Sync user profile
        const userDoc = doc(db, 'users', currentUser.uid);
        setDoc(userDoc, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: Timestamp.now(),
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`));
      }
    });
    return () => unsubscribe();
  }, []);

  // History Listener
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const historyPath = `users/${user.uid}/qr_history`;
    const q = collection(db, historyPath);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: QRCodeConfig[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as QRCodeConfig);
      });
      setHistory(items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, historyPath);
    });

    return () => unsubscribe();
  }, [user]);

  const updateConfig = useCallback((newConfig: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const updateDotsOptions = useCallback((options: Partial<QRConfig['dotsOptions']>) => {
    setConfig((prev) => ({
      ...prev,
      dotsOptions: { ...prev.dotsOptions, ...options },
    }));
  }, []);

  const updateCornersSquareOptions = useCallback((options: Partial<QRConfig['cornersSquareOptions']>) => {
    setConfig((prev) => ({
      ...prev,
      cornersSquareOptions: { ...prev.cornersSquareOptions, ...options },
    }));
  }, []);

  const updateCornersDotOptions = useCallback((options: Partial<QRConfig['cornersDotOptions']>) => {
    setConfig((prev) => ({
      ...prev,
      cornersDotOptions: { ...prev.cornersDotOptions, ...options },
    }));
  }, []);

  const updateImageOptions = useCallback((options: Partial<QRConfig['imageOptions']>) => {
    setConfig((prev) => ({
      ...prev,
      imageOptions: { ...prev.imageOptions, ...options },
    }));
  }, []);

  const saveToHistory = async (name: string) => {
    if (!user) return;
    const id = crypto.randomUUID();
    const qrData: QRCodeConfig = {
      id,
      name,
      data: config.data,
      config: JSON.parse(JSON.stringify(config)), // Deep clone
      createdAt: Timestamp.now(),
    };
    const path = `users/${user.uid}/qr_history/${id}`;
    try {
      await setDoc(doc(db, path), qrData);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteFromHistory = async (id: string) => {
    if (!user) return;
    // Implementation for delete if needed
  };

  return (
    <QRContext.Provider
      value={{
        config,
        user,
        history,
        isAuthReady,
        updateConfig,
        updateDotsOptions,
        updateCornersSquareOptions,
        updateCornersDotOptions,
        updateImageOptions,
        saveToHistory,
        deleteFromHistory,
      }}
    >
      {children}
    </QRContext.Provider>
  );
};

export const useQR = () => {
  const context = useContext(QRContext);
  if (context === undefined) {
    throw new Error('useQR must be used within a QRProvider');
  }
  return context;
};
