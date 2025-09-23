const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="items-center justify-center flex min-h-screen">
          {children}
        </div>
    );
  };
  
  export default AuthLayout;