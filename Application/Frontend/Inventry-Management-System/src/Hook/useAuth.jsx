export const useAuth = () => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    return {
        isLoggedIn: !!token,
        token,
        userRole,
        userId
    };
};
