"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { useIngredientStore } from "@/store/ingredient.store";
import { Button, Form, Input, Select, ListBox, TextField, FieldError, Spinner } from "@heroui/react";
import { useState, useTransition } from "react";

const initialState = {
	name: "",
	category: "",
	unit: "",
	pricePerUnit: null as number | null,
	description: "",
};

const IngredientForm = () => {
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState(initialState);
	const { addIngredient } = useIngredientStore();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (formData: FormData) => {
		startTransition(async () => {
			await addIngredient(formData);
			const storeError = useIngredientStore.getState().error;

			if (storeError) {
				setError(storeError);
			} else {
				setError(null)
				setFormData(initialState);
			}
		});
	};

	return (
		<Form className="w-full" action={handleSubmit}>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<TextField 
				isRequired 
				className="w-full max" 
				type="text"
				validate={(value) => {
					if (!value) return "Название обязательно";
					return null;
				}}
			>
				<Input
					name="name"
					placeholder="Введите название ингредиента"
					type="text"
					value={formData.name}
					className="bg-default-100 text-sm outline-none w-full"
					onChange={(e) => setFormData({...formData, name: e.target.value})}
				/>
				<FieldError />
			</TextField>
			<div className="flex gap-2 w-full mt-2 mb-2">
				<div className="w-1/3">
					<Select 
						isRequired 
						name="category"
						placeholder="Категория"
						value={formData.category || undefined}
						onChange={(value) => setFormData({ ...formData, category: value })}
					>
						<Select.Trigger className="bg-default-100 w-full">
							<Select.Value className="truncate text-sm"/>
							<Select.Indicator className="text-black"/>
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{CATEGORY_OPTIONS.map((option) => (
									<ListBox.Item 
										key={option.value} 
										id={option.value} 
										textValue={option.label}
										className="text-black"
									>
										{option.label}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
				</div>
				<div className="w-1/3">
					<Select 
						isRequired 
						name="unit"
						placeholder="Ед. изм."
						value={formData.unit || undefined}
						onChange={(value) => setFormData({ ...formData, unit: value })}
					>
						<Select.Trigger className="bg-default-100 w-full">
							<Select.Value className="truncate text-sm"/>
							<Select.Indicator className="text-black"/>
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{UNIT_OPTIONS.map((option) => (
									<ListBox.Item 
										key={option.value} 
										id={option.value} 
										textValue={option.label}
										className="text-black"
									>
										{option.label}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>	
				</div>
				<div className="w-1/3">
					<TextField 
						isRequired 
						className="w-full max-w-64 relative" 
						type="number"
						validate={(value) => {
							if (!value) return "Цена обязательна";
							const num = parseFloat(value);
							if (isNaN(num) || num < 0)
								return "Цена должна быть положительной";
							return null;
						}}
					>
						<Input
							name="pricePerUnit"
							placeholder="Цена"
							type="number"
							value={
								formData.pricePerUnit !== null
								? formData.pricePerUnit.toString()
								: ""
							}
							className="bg-default-100 text-sm focus:outline-none"
							onChange={(e) => {
								const value = e.target.value ? parseFloat(e.target.value) : null;
								setFormData({...formData, pricePerUnit: value});
							}}
						/>
						<span className="absolute right-1 top-4.5 transform -translate-y-1/2 text-default-500 pointer-events-none text-black">
							₴
						</span>
						<FieldError />
					</TextField>
				</div>
			</div>
			<Input
        name="description"
        placeholder="Введите описание (необязательно)"
        type="text"
        value={formData.description}
				className="bg-default-100 text-sm outline-none w-full"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
			<div className="flex w-full items-center justify-end mt-2">
        <Button
					variant="secondary"
					type="submit"
					isDisabled={isPending}
					className={isPending ? "opacity-100" : ""}
				>
					{isPending && <Spinner size="sm" className="text-white !opacity-100"/>}
					Добавить ингредиент
				</Button>
      </div>
		</Form>
	)
}

export default IngredientForm;