"use client";

import { registerUser } from "@/actions/register";
import {Check} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, TextField} from "@heroui/react";
import { useState } from "react";

interface IProps {
  onClose: () => void;
}

const RegistrationForm = ({ onClose }: IProps) => {
	const [formData, setFormData] = useState({
			email: "test@mail.r",
			password: "12345",
			confirmPassword: "12345"
 		});

	const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена:", formData);

		const result = await registerUser(formData);

		console.log(result);

    onClose();
  };
 
  return (
	
    <Form className="flex w-77 flex-col gap-4 ml-[2px]" onSubmit={handleSubmit}>
      <TextField
				aria-label="Email"
        isRequired
        name="email"
        type="email"
				
        validate={(value) => {
					if (!value) return "Почта обязательна";
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Некорректный email";
          }
          return null;
        }}
      >
        <Input 
					placeholder="Введите email" 
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
        <FieldError />
      </TextField>
      <TextField
        isRequired
        minLength={6}
        name="password"
        type="password"
        validate={(value) => {
					if (!value) return "Пароль обязателен";
          if (value.length < 6) {
            return "Пароль должен быть не менее 6 символов";
          }
          return null;
        }}
      >
        <Input 
					placeholder="Введите пароль"
					value={formData.password}
					onChange={(e) => setFormData({ ...formData, password: e.target.value })}
				/>
        <FieldError />
      </TextField>
			<TextField
        isRequired
        minLength={6}
        name="confirmPassword"
        type="password"
        validate={(value) => {
					if (!value) return "Пароль для подтверждения обязателен";
          if (value !== formData.password) return "Пароли не совпадают";
          return null;
        }}
      >
        <Input 
					placeholder="Введите пароль"
					value={formData.confirmPassword}
					onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
				/>
        <FieldError />
      </TextField>
      <div className="flex gap-2">
        <Button type="reset" variant="secondary" onPress={onClose}>
          Отмена
        </Button>
				<Button type="submit">
          <Check />
          Зарегестрироваться
        </Button>
      </div>
    </Form>
  );
};

export default RegistrationForm;