import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('FoodDetails', {
      id,
    });
  }

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const response = await api.get<Food[]>('favorites');

      const formattedFavorites = response.data.map(food => {
        return {
          ...food,
          formattedPrice: formatValue(food.price),
        };
      });

      setFavorites(formattedFavorites);
    }

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              key={item.id}
              onPress={() => handleNavigate(item.id)}
              activeOpacity={0.6}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
