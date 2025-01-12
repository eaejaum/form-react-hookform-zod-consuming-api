import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { z } from "zod";

const UserRegisterSchema = z.object({
  name: z.string().min(1, 'Campo nome obrigatório'), // or .min(1, {message: 'Campo nome obrigatório'})
  email: z.string().min(1, 'Campo email obrigatório').email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  password_confirmation: z.string().min(8, 'A confirmação de senha deve ter no mínimo 8 caracteres'),
  phone: z.string().min(1, 'Campo telefone obrigatório').regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  cpf: z.string().min(1, 'Campo CPF obrigatório').regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  zipcode: z.string().min(1, 'Campo CEP obrigatório').regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  city: z.string().min(1, 'Campo cidade obrigatório'),
  address: z.string().min(1, 'Campo endereço obrigatório'),
  terms: z.boolean({message: 'Você precisa aceitar os termos de uso'})
}).refine((data) => {
  return data.password === data.password_confirmation
}, {message: 'As senhas devem ser iguais', path: ['password_confirmation']});

type UserRegister = z.infer<typeof UserRegisterSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(UserRegisterSchema)
  });
  const registerWithMask = useHookFormMask(register);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  async function handleZipCodeBlur(
    e: React.FocusEvent<HTMLInputElement, Element>
  ) {
    const zipcode = e.target.value;
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);
    if (res.ok) {
      const data = await res.json();
      setValue("address", data.street);
      setValue("city", data.city);
    }
  }

  async function submitForm(data: FieldValues) {
    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      for (const field in resData.errors) {
        setError(field as keyof UserRegister, { type: "manual", message: resData.errors[field] });
      }
    } else {
      console.log(resData);
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register("name")}
        />
        {/* Sugestão de exibição de erro de validação */}
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="name" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          className=""
          type="email"
          id="email"
          {...register("email")}
        />

        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            {...register("password")}
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password" />
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirm-password"
            {...register("password_confirmation")}
          />
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask("phone", ["(99) 99999-9999"])}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="phone" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask("cpf", ["999.999.999-99"])}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="cpf" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask("zipcode", ["99999-999"], {
            onBlur: handleZipCodeBlur
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="zipcode" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          {...register("address")}
          id="address"
          disabled
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          {...register("city")}
          id="city"
          disabled
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms")}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="terms" />
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-300"
      >
        {isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
}
