"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from "@/store/ingredient.store"
import { Button, Table } from "@heroui/react";

const IngredientsTable = () => {
	const { ingredients, removeIngredient, isLoading } = useIngredientStore();
	const { isAuth } = useAuthStore();

	const handleDelete = async (id: string) => {
		await removeIngredient(id);
	}

	const getCategoryLabel = (value: string) => {
		const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
		return option ? option.label : value;
	};

	const getUnitLabel = (value: string) => {
		const option = UNIT_OPTIONS.find((opt) => opt.value === value);
		return option ? option.label : value;
	};

	if (!isAuth) {
		return <p>Не авторизирован</p>
	}

	return !isLoading && isAuth ? (
		<Table className="w-full [&_td]:text-black mt-5">
      <Table.ScrollContainer >
        <Table.Content aria-label="Список ингредиентов" className="mt-4 text-black">
          <Table.Header>
            <Table.Column isRowHeader>Название</Table.Column>
            <Table.Column>Категория</Table.Column>
            <Table.Column>Ед. изм.</Table.Column>
            <Table.Column>Цена за единицу</Table.Column>
						<Table.Column>Описание</Table.Column>
						<Table.Column>Действия</Table.Column>
          </Table.Header>
          <Table.Body className="text-black">
						{ingredients.map((ingredient) => (
							<Table.Row key={ingredient.id}>
								<Table.Cell >{ingredient.name}</Table.Cell>
								<Table.Cell>{getCategoryLabel(ingredient.category)}</Table.Cell>
								<Table.Cell>{getUnitLabel(ingredient.unit)}</Table.Cell>
								<Table.Cell>
									{ingredient.pricePerUnit !== null
										? `${ingredient.pricePerUnit} ₴`
										: "-"}
								</Table.Cell>
								<Table.Cell>{ingredient.description || "-"}</Table.Cell>
								<Table.Cell>
									<Button
										color="danger"
										size="sm"
										onPress={() => handleDelete(ingredient.id)}
									>
										Удалить
									</Button>
								</Table.Cell>
           		</Table.Row>
						))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
	) : (
		<p className="mt-4">Загрузка...</p>
	);
}

export default IngredientsTable;