import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
    User, Mail, Lock, Phone, CreditCard, Briefcase, Clock, DollarSign,
    ChevronLeft, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';

const SignupForm: React.FC = () => {
    const router = useRouter();
    const { signUp, user } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        cnic: '',
        position: 'Senior Developer',
        shift: 'Day Shift' as 'Day Shift' | 'Night Shift',
        entryTime: '09:00',
        exitTime: '18:00',
        breakIn: '13:00',
        breakOver: '14:00',
        salary: '',
        termsAccepted: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.password) {
                setError("Please fill all required fields");
                return;
            }
        }
        setError(null);
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            nextStep();
            return;
        }

        if (!formData.termsAccepted) {
            setError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
                cnic: formData.cnic,
                position: formData.position,
                shift: formData.shift,
                entryTime: formData.entryTime,
                exitTime: formData.exitTime,
                breakIn: formData.breakIn,
                breakOver: formData.breakOver,
                salary: formData.salary
            });

            if (signUpError) {
                const errorMsg = typeof signUpError === 'string' ? signUpError : signUpError.message;
                setError(errorMsg);
                toast.error(errorMsg);
                setLoading(false);
            } else {
                toast.success('Registration Successfully! Please login.');
                setSuccess(true);
            }
        } catch (err: any) {
            const errorMsg = err.message || 'An unexpected error occurred';
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    // Removed auto-login redirect
    React.useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    if (success) {
        return (
            <div className="signup-success text-center py-10">
                <div className="success-icon mb-6">✓</div>
                <h2 className="text-3xl font-black mb-2">Registration Complete!</h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Your employee profile has been created.</p>
                <p className="mt-4 text-sm font-bold">Redirecting to dashboard...</p>
            </div>
        );
    }


    return (
        <div className="signup-container">
            {/* Step Indicator */}
            <div className="flex justify-between items-center mb-12 px-4 max-w-xs mx-auto">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all shadow-lg ${step === s ? 'bg-black text-white scale-110' :
                            step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                            {step > s ? <CheckCircle2 size={18} /> : s}
                        </div>
                        {s < 3 && <div className={`flex-1 h-[2px] mx-2 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
                    </React.Fragment>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Personal Identity</h2>
                            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mt-1">Basic Contact Information</p>
                        </div>

                        <div className="form-group">
                            <label>Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@company.com"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+92 XXX XXXXXXX"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>CNIC Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="text"
                                    name="cnic"
                                    value={formData.cnic}
                                    onChange={handleChange}
                                    placeholder="XXXXX-XXXXXXX-X"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Access Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Job Designation</h2>
                            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mt-1">Role & Shift Parameters</p>
                        </div>

                        <div className="form-group">
                            <label>Position Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm appearance-none"
                                >
                                    <option>MERN Stack Developer</option>
                                    <option>Mobile App Developer (Flutter/RN)</option>
                                    <option>UI/UX Graphic Designer</option>
                                    <option>Team Lead (Operations)</option>
                                    <option>Project Manager</option>
                                    <option>Quality Assurance Engineer</option>
                                    <option>Sales & Marketing Executive</option>
                                    <option>Senior Software Engineer</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Shift Protocol</label>
                            <div className="flex gap-4">
                                {['Day Shift', 'Night Shift'].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, shift: s as any }))}
                                        className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.shift === s ? 'border-black bg-white text-black' : 'border-slate-100 bg-zinc-50 text-zinc-400'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Entry Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                    <input
                                        type="time"
                                        name="entryTime"
                                        value={formData.entryTime}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Exit Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                    <input
                                        type="time"
                                        name="exitTime"
                                        value={formData.exitTime}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Break Start (In)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                    <input
                                        type="time"
                                        name="breakIn"
                                        value={formData.breakIn}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Break Over</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                    <input
                                        type="time"
                                        name="breakOver"
                                        value={formData.breakOver}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Payroll Detail</h2>
                            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mt-1">Compensation Information</p>
                        </div>

                        <div className="form-group">
                            <label>Monthly Gross Salary (PKR)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 150,000"
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-zinc-100 focus:border-black outline-none transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 p-6 bg-zinc-50 rounded-[2rem] border border-slate-100 mt-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={16} className="text-black" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-black">Company Policy Audit</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                    Annual Leaves: 12 Days (1 Leave per month allocation)
                                </li>
                                <li className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                    Operational Days: Monday - Saturday
                                </li>
                                <li className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                    Weekly Holiday: Sunday (Protocol Offline)
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <div className="relative flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-black rounded-lg cursor-pointer"
                                    />
                                </div>
                                <span className="text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                                    I acknowledge the HR policy and verify that all data provided matches my official CNIC.
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {error && <p className="text-rose-500 text-[10px] font-bold uppercase mt-4 text-center">{error}</p>}

                <div className="flex justify-between items-center mt-12">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                            <ChevronLeft size={20} /> Previous
                        </button>
                    ) : (
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Already have an account? <Link href="/login" className="text-black cursor-pointer hover:underline">Login</Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Processing...' : step < 3 ? 'Next Phase' : 'Complete Registration'}
                        {!loading && step < 3 && <ArrowRight size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;
