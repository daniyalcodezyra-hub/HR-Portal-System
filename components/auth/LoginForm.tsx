import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface LoginFormProps {
    onSuccess?: () => void;
}

import { Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const router = useRouter();
    const { signIn, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});

    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const { error: signInError } = await signIn(formData.email, formData.password);
            console.log("Login Attempt:", { email: formData.email, error: signInError });

            if (signInError) {
                const errorMsg = typeof signInError === 'string' ? signInError : signInError.message || 'Invalid email or password';
                setErrors({
                    general: errorMsg,
                });
                toast.error(errorMsg);
                setLoading(false);
                return;
            }

            toast.success('Access Granted! Redirecting...');
            setLoading(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            setErrors({
                general: 'An unexpected error occurred. Please try again.',
            });
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user && !loading) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/employee');
            }
        }
    }, [user, loading, router]);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Display */}
            {errors.general && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                        <span className="font-black text-xs">!</span>
                    </div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-tight">
                        {errors.general}
                    </p>
                </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2" htmlFor="email">
                    Personnel Email
                </label>
                <div className="relative group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="username@codezyra.com"
                        disabled={loading}
                        className={`w-full bg-white border ${errors.email ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 group-hover:border-black'} px-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all placeholder:text-zinc-300 placeholder:italic`}
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-2 ml-2">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2" htmlFor="password">
                    Access Key
                </label>
                <div className="relative group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        disabled={loading}
                        className={`w-full bg-white border ${errors.password ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 group-hover:border-black'} px-6 py-4 rounded-2xl font-bold text-sm outline-none transition-all placeholder:text-zinc-300`}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && (
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-2 ml-2">
                            {errors.password}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-zinc-800 disabled:grayscale"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Authenticating...
                    </>
                ) : (
                    <>Login</>
                )}
            </button>

            {/* Footer Link */}
            <div className="pt-6 border-t border-slate-50 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    New Personnel? {' '}
                    <Link href="/signup" className="text-black font-black hover:underline underline-offset-4">
                        Signup
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
