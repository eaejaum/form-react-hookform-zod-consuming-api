import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { withMask } from "use-mask-input";
// import { EyeOffIcon } from 'lucide-react';

export default function Form() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [address, setAddress] = useState({ city: '', street: '' });

  async function handleZipCodeBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
    const zipcode = e.target.value;
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);
    if(res.ok) {
      const data = await res.json();
      setAddress({
        city: data.city,
        street: data.street
      })
    }
  }

  return (
    <form>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" />
        {/* Sugestão de exibição de erro de validação */}
        <div className="min-h-4">
          <p className="text-xs text-red-400 mt-1">O nome é obrigatório.</p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" />
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input type={passwordVisible ? "text" : "password"} id="password" />
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
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirm-password"
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
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input type="text" id="phone" ref={withMask('(99) 99999-9999')}/>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" ref={withMask('999.999.999-99')} />
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input type="text" id="cep" ref={withMask('99.999-999')} onBlur={(e) => handleZipCodeBlur(e)} />
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          value={address.street}
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          value={address.city}
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input type="checkbox" id="terms" className="mr-2 accent-slate-500" />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors"
      >
        Cadastrar
      </button>
    </form>
  );
}
