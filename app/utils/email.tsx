// 

export function Email(magicLink) {
  

  return(
      `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
    <tbody>
      <tr>
        <td>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:rgb(253,230,138)">
            <tbody style="width:100%">
              <tr style="width:100%">
                <p style="text-align:center;font-size:2.25rem;line-height:2.5rem;font-weight:900;background-color:rgb(253,230,138);color:rgb(255,255,255);padding-top:1.5rem;padding-bottom:1.5rem;margin:16px 0">Tales and Pages</p>
              </tr>
            </tbody>
          </table>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:rgb(125,211,252);text-align:center">
            <tbody style="width:100%">
              <tr style="width:100%">
                <p style="text-align:center;color:rgb(255,255,255);padding-top:1rem;padding-bottom:1rem;font-size:14px;line-height:24px;margin:16px 0">We heard you wanted to login. So we have sent you a link.</p>
                <a href="${magicLink}" style="width:100%;max-width:20rem;margin-bottom:2.5rem;text-align:center;border-radius:0.25rem;padding-top:1rem;padding-bottom:1rem;color:rgb(125,211,252);font-weight:900;background-color:rgb(255,255,255);line-height:100%;text-decoration:none;display:inline-block;mso-padding-alt:0px;padding:16px 0px 16px 0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:NaN%;mso-text-raise:24" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:12px">Login</span><span><!--[if mso]><i style="mso-font-width:NaN%" hidden>&#8203;</i><![endif]--></span></a>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`
  );
}

export default Email;
