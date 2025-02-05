import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Format credentials properly
        const loginData = {
            email: credentials.email.trim().toLowerCase(),
            password: credentials.password
        };

        console.log('Attempting login with:', { email: loginData.email }); // Debug log

        try {
            const response = await fetch(
                'https://case-bud-backend.onrender.com/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(loginData),
                    credentials: 'include'
                }
            );

            // Log the full response for debugging
            console.log('Response status:', response.status);
            console.log(
                'Response headers:',
                Object.fromEntries(response.headers)
            );

            const data = await response.json();
            console.log('Login response data:', {
                status: response.status,
                ok: response.ok,
                data: { ...data, token: data.token ? 'exists' : 'missing' }
            });

            if (response.ok && data.token) {
                // Ensure proper token format
                const token = data.token.startsWith('Bearer ')
                    ? data.token
                    : `Bearer ${data.token}`;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data.user || {}));
                console.log('Login successful, redirecting to chat...');
                navigate('/chat', { replace: true });
            } else {
                let errorMsg =
                    data.message || data.error || 'Invalid credentials';
                if (response.status === 401) {
                    errorMsg =
                        'Email or password is incorrect. Please try again.';
                } else if (response.status === 404) {
                    errorMsg = 'Account not found. Please register first.';
                }
                console.error('Login failed:', errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        if (!credentials.email || !credentials.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!credentials.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    // Add social login handlers
    const handleSocialLogin = (provider) => {
        console.log(`Logging in with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className="min-h-screen flex bg-slate-900">
            {/* Left Column - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]" />
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            CaseBud
                        </h2>
                    </div>

                    <div className="mt-auto">
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Transform Your Legal Practice with AI Assistance
                        </h1>
                        <p className="mt-4 text-lg text-blue-100">
                            Streamline your workflow and enhance your legal
                            research with cutting-edge AI technology.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="text-white font-semibold">
                                    Smart Research
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    Intelligent legal document analysis
                                </p>
                            </div>
                            <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg">
                                <h3 className="text-white font-semibold">
                                    24/7 Available
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    Access assistance anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Please sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="animate-fadeIn rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                            <div className="flex items-center">
                                <svg
                                    className="mr-2 h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center px-4 py-3 border border-slate-600 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-900 text-slate-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (validateForm()) {
                                handleSubmit(e);
                            }
                        }}
                        className="mt-8 space-y-6"
                    >
                        <div className="space-y-5">
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder=" "
                                    className="peer w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/50 text-white placeholder-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            email: e.target.value
                                        })
                                    }
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-2 -top-2.5 bg-slate-900 px-2 text-sm text-slate-400 transition-all 
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
                           peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-blue-500"
                                >
                                    Email address
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder=" "
                                    className="peer w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/50 text-white placeholder-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            password: e.target.value
                                        })
                                    }
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-2 -top-2.5 bg-slate-900 px-2 text-sm text-slate-400 transition-all 
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 
                           peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-blue-500"
                                >
                                    Password
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-slate-400"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/reset-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
