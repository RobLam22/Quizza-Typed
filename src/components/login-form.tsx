import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import { useActionState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { signInUser } = useAuth();
    const navigate = useNavigate();
    const [error, submitAction, isPending] = useActionState(
        async (_previousState: unknown, formData: FormData) => {
            const email = formData.get('email')?.toString() ?? '';
            const password = formData.get('password')?.toString() ?? '';
            try {
                const {
                    success,
                    data,
                    error: signInError,
                } = await signInUser(email, password);

                if (signInError) {
                    return new Error(signInError);
                }
                if (success && data?.session) {
                    navigate('/dashboard');
                }
                return null;
            } catch (error: any) {
                console.error('Sign in error: ', error.message);
                return new Error(
                    'An unexpected error occurred. Please try again.'
                );
            }
        },
        null
    );

    return (
        <Card className="m-auto my-auto max-w-sm" {...props}>
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={submitAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                                aria-required="true"
                                aria-invalid={error ? 'true' : 'false'}
                                aria-describedby={
                                    error ? 'signin-error' : undefined
                                }
                                disabled={isPending}
                            />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-indigo-600"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                required
                                aria-required="true"
                                aria-invalid={error ? 'true' : 'false'}
                                aria-describedby={
                                    error ? 'signin-error' : undefined
                                }
                                disabled={isPending}
                            />
                        </Field>
                        <Field>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-300"
                                type="submit"
                                aria-busy={isPending}
                            >
                                {isPending ? 'Logging in' : 'Log In'}
                            </Button>
                            {error && (
                                <p
                                    id="signin-error"
                                    className="text-red-500 text-sm text-center"
                                >
                                    {error.message}
                                </p>
                            )}
                            <FieldDescription className="text-center">
                                Don't have an account?{` `}
                                <Link
                                    className="hover:text-indigo-600"
                                    to="/signup"
                                >
                                    Sign up
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
