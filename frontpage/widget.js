window.addEventListener('DOMContentLoaded', function() {
 const apiURL = 'https://to-run-widget-panel-js.onrender.com/api/market';

 function formatCurrency(value) {
 return `$${Number(value).toLocaleString()}`;
 }

 function updateValueAndChange(valueId, changeId, data) {
 if (!data) {
document.getElementById(valueId).textContent = "Currently data unavailable";
document.getElementById(changeId).textContent = "";
document.getElementById(changeId).className = '';
return;
 }

 document.getElementById(valueId).textContent = formatCurrency(data.price);
 document.getElementById(changeId).innerHTML = `
<span class="${data.change >= 0 ? 'positive' : 'negative'}">
 ${data.change >= 0 ? '+' : ''}${data.change}
</span><br />
<span class="${data.percent >= 0 ? 'positive' : 'negative'}">
 (${data.percent >= 0 ? '+' : ''}${data.percent}%)
</span>
 `;
 document.getElementById(changeId).className = 'market-widget-change ' + (data.change >= 0 ? 'positive' : 'negative');
 }

 function updateLiveData() {
 fetch(apiURL)
.then(response => response.json())
.then(data => {
 updateValueAndChange('nasdaq-value', 'nasdaq-change', data.nasdaq);
 updateValueAndChange('sp500-value', 'sp500-change', data.sp500);
 updateValueAndChange('dowjones-value', 'dowjones-change', data.dowjones);

 const now = new Date();
 const timeStr = now.toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit',
 second: '2-digit',
 hour12: true,
 timeZone: 'America/New_York',
 });
 document.getElementById('market-widget-updated').textContent = `Last updated: ${timeStr} ET`;
}) 
.catch(() => {
 updateValueAndChange('nasdaq-value', 'nasdaq-change', null);
 updateValueAndChange('sp500-value', 'sp500-change', null);
 updateValueAndChange('dowjones-value', 'dowjones-change', null);
 document.getElementById('market-widget-updated').textContent = "Last updated: --";
});
 }

 updateLiveData();
 setInterval(updateLiveData, 60000);
});