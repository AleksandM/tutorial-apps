import {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import useAvailableHarvest from '../hooks/useAvailableHarvest';
import {getCpS} from '../program-utils/cropUpgrades';
import {FarmAccount} from '../program-utils/farmingProgram';
import {useAppState} from '../store/useAppState';
import FarmImage from './FarmImage';

type Props = Readonly<{
  farmAccount: FarmAccount;
}>;

export default function FarmView2({farmAccount}: Props) {
  const {harvestFarm} = useAppState();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const {availableHarvest} = useAvailableHarvest({farmAccount});

  const handleHarvest = useCallback(async () => {
    setIsHarvesting(true);
    try {
      await harvestFarm();
    } catch (error: any) {
      if (error instanceof Error) {
        console.error(`Failed to harvest: ${error.message}`);
      }
    } finally {
      setIsHarvesting(false);
    }
  }, [harvestFarm]);

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Text style={styles.harvestedText}>
          🌾 {farmAccount.harvestPoints.toString()} 🌾
        </Text>
        <Text> harvest points </Text>
      </View>
      <FarmImage isHarvesting={isHarvesting} onPress={handleHarvest} />
      <View style={styles.textSection}>
        <Text style={styles.text}>Press 🏡 to harvest! </Text>
        <Text style={styles.harvestedText}>
          👩‍🌾 {Math.floor(availableHarvest)} crops 👨‍🌾
        </Text>
        <Text style={styles.text}>
          (+{Math.floor(getCpS(farmAccount))} 🌾 per second)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'left',
  },
  textSection: {
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 50,
    height: 50,
  },
  harvestedText: {
    fontSize: 32,
    color: '#333', // Dark gray text color
  },
  text: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
});
