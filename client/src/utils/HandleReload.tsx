export const handleReload = (redirectUrl?: string | null) => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
  
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload(); 
    } else {
      sessionStorage.removeItem('hasReloaded'); 
      if (redirectUrl) {
        window.location.href = redirectUrl; 
    }
  };
}