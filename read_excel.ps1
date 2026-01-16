$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open('C:\Users\doich\Downloads\barcodes.xlsx')
$workbook.SaveAs('C:\Users\doich\Downloads\barcodes_temp.csv', 6)
$workbook.Close($false)
$excel.Quit()
Get-Content 'C:\Users\doich\Downloads\barcodes_temp.csv' -TotalCount 15
