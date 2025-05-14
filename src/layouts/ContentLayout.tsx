function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto px-7 max-w-3xl sm:max-w-6xl sm:px-16 w-full h-fit">
            {children}
        </div>
    );
}

export default ContentLayout;