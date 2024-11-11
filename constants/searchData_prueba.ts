import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';  // Asegúrate de tener esta importación

const useDynamicRoutes = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadRoutes = async () => {
      const rootDirectories = [
        'Business-info',
        'Printers',
        'Payment-methods',
        'Integrations',
        'Tablet-configuration',
        'Security',
        'Advanced-options',
        'Tax-configuration-ec',
      ];

      const dynamicRoutes: any[] = [];

      const readDirectoryRecursive = async (directoryPath: string) => {
        try {
          const files = await FileSystem.readDirectoryAsync(directoryPath);
          for (const file of files) {
            const filePath = `${directoryPath}/${file}`;
            const stat = await FileSystem.getInfoAsync(filePath);

            if (stat.isDirectory) {
              await readDirectoryRecursive(filePath);
            } else if (file.endsWith('.tsx')) {
              const route = {
                nameKey: file.replace('.tsx', ''),
                route: filePath.replace('app', '').replace('.tsx', ''),
                translation: t(file.replace('.tsx', '')), // Traducir la clave
              };
              dynamicRoutes.push(route);
            }
          }
        } catch (error) {
          console.error('Error al leer el directorio:', error);
        }
      };

      for (const dir of rootDirectories) {
        await readDirectoryRecursive(`${FileSystem.documentDirectory}app/${dir}`);
      }

      console.log("Rutas cargadas: ", dynamicRoutes); // Verificar el contenido de dynamicRoutes
      setRoutes(dynamicRoutes);
    };

    loadRoutes();
  }, [t]);  // Hacemos que dependa de las traducciones

  return routes;
};


export default useDynamicRoutes;
