"use client";

import { signInWithCredentials } from "@/actions/sign-in";
import {Check} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, TextField} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
	const router = useRouter();

	const [formData, setFormData] = useState({
			email: "test@mail.r",
			password: "12345",
 		});

	const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена:", formData);

		await signInWithCredentials(formData.email, formData.password);
		
		window.location.reload();
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
        name="password"
        type="password"
        validate={(value) => {
					if (!value) return "Пароль обязателен";
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
      <div className="flex gap-2">
        <Button type="reset" variant="secondary" onPress={onClose}>
          Отмена
        </Button>
				<Button type="submit">
          <Check />
          Авторизация
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;